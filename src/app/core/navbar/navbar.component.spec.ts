/* eslint-disable @typescript-eslint/no-unused-vars */
import { DebugElement, NgModule } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, waitForAsync } from '@angular/core/testing';
import { Router } from '@angular/router';

import Spy = jasmine.Spy;

import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing';
import {
    faEnvelope,
    faFileAlt,
    faHome,
    faNetworkWired,
    faSearch,
    IconDefinition,
} from '@fortawesome/free-solid-svg-icons';
import { NgbCollapseModule, NgbConfig, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { cleanStylesFromDOM } from '@testing/clean-up-helper';
import { click, clickAndAwaitChanges } from '@testing/click-helper';
import {
    expectSpyCall,
    expectToBe,
    expectToContain,
    expectToEqual,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';
import { RouterLinkStubDirective } from '@testing/router-stubs';

import { LOGOSDATA } from '@awg-core/core-data';
import { Logos } from '@awg-core/core-models';
import { CoreService } from '@awg-core/services';

import { EDITION_ROUTE_CONSTANTS } from '@awg-views/edition-view/edition-route-constants';
import { EditionComplex } from '@awg-views/edition-view/models';
import { EditionComplexesService } from '@awg-views/edition-view/services';

import { NavbarComponent } from './navbar.component';

/** Helper function */
function generateExpectedOrderOfRouterlinks(editionComplexes: EditionComplex[]): string[][] {
    const baseLinks = [
        ['/home'],
        [EDITION_ROUTE_CONSTANTS.EDITION.route, EDITION_ROUTE_CONSTANTS.SERIES.route],
        [EDITION_ROUTE_CONSTANTS.EDITION.route, EDITION_ROUTE_CONSTANTS.ROWTABLES.route],
        [EDITION_ROUTE_CONSTANTS.EDITION.route, EDITION_ROUTE_CONSTANTS.PREFACE.route],
    ];

    const editionLinks = editionComplexes.flatMap(complex => [
        [complex.baseRoute, EDITION_ROUTE_CONSTANTS.EDITION_INTRO.route],
        [complex.baseRoute, EDITION_ROUTE_CONSTANTS.EDITION_SHEETS.route],
        [complex.baseRoute, EDITION_ROUTE_CONSTANTS.EDITION_REPORT.route],
    ]);

    const otherLinks = [['/structure'], ['/data'], ['/contact']];

    return [...baseLinks, ...editionLinks, ...otherLinks];
}

describe('NavbarComponent (DONE)', () => {
    let component: NavbarComponent;
    let fixture: ComponentFixture<NavbarComponent>;
    let compDe: DebugElement;

    let linkDes: DebugElement[];
    let routerLinks;

    let coreServiceSpy: Spy;
    let isActiveRouteSpy: Spy;
    let routerSpy: Spy;
    let provideMetaDataSpy: Spy;
    let toggleNavSpy: Spy;

    let mockCoreService: Partial<CoreService>;
    let mockRouter: Partial<Router>;

    let expectedLogos: Logos;

    let expectedContactIcon: IconDefinition;
    let expectedEditionIcon: IconDefinition;
    let expectedHomeIcon: IconDefinition;
    let expectedSearchIcon: IconDefinition;
    let expectedStructureIcon: IconDefinition;

    let expectedEditionComplexes: EditionComplex[];
    let expectedOrderOfRouterlinks: string[][];

    const expectedEditionRouteConstants: typeof EDITION_ROUTE_CONSTANTS = EDITION_ROUTE_CONSTANTS;

    // global NgbConfigModule
    @NgModule({ imports: [NgbCollapseModule, NgbDropdownModule], exports: [NgbCollapseModule, NgbDropdownModule] })
    class NgbConfigModule {
        constructor(config: NgbConfig) {
            // Set animations to false
            config.animation = false;
        }
    }

    beforeEach(waitForAsync(() => {
        // Stub service for test purposes
        mockCoreService = {
            getLogos: () => expectedLogos,
        };

        // Router spy object
        mockRouter = jasmine.createSpyObj('Router', ['isActive']);

        TestBed.configureTestingModule({
            imports: [FontAwesomeTestingModule, NgbConfigModule],
            declarations: [NavbarComponent, RouterLinkStubDirective],
            providers: [
                { provide: CoreService, useValue: mockCoreService },
                { provide: Router, useValue: mockRouter },
            ],
        }).compileComponents();
    }));

    beforeAll(() => {
        EditionComplexesService.initializeEditionComplexesList();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(NavbarComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Test data
        expectedLogos = LOGOSDATA;

        expectedEditionComplexes = [
            EditionComplexesService.getEditionComplexById('OP3'),
            EditionComplexesService.getEditionComplexById('OP4'),
            EditionComplexesService.getEditionComplexById('OP12'),
            EditionComplexesService.getEditionComplexById('OP23'),
            EditionComplexesService.getEditionComplexById('OP25'),
            EditionComplexesService.getEditionComplexById('M22'),
            EditionComplexesService.getEditionComplexById('M30'),
            EditionComplexesService.getEditionComplexById('M31'),
            EditionComplexesService.getEditionComplexById('M34'),
            EditionComplexesService.getEditionComplexById('M35_42'),
            EditionComplexesService.getEditionComplexById('M37'),
        ];
        expectedOrderOfRouterlinks = generateExpectedOrderOfRouterlinks(expectedEditionComplexes);

        expectedContactIcon = faEnvelope;
        expectedEditionIcon = faFileAlt;
        expectedHomeIcon = faHome;
        expectedSearchIcon = faSearch;
        expectedStructureIcon = faNetworkWired;

        // Spies on component functions
        // `.and.callThrough` will track the spy down the nested describes, see
        // https://jasmine.github.io/2.0/introduction.html#section-Spies:_%3Ccode%3Eand.callThrough%3C/code%3E
        coreServiceSpy = spyOn(mockCoreService, 'getLogos').and.callThrough();
        isActiveRouteSpy = spyOn(component, 'isActiveRoute').and.callThrough();
        routerSpy = mockRouter.isActive as jasmine.Spy;
        provideMetaDataSpy = spyOn(component, 'provideMetaData').and.callThrough();
        toggleNavSpy = spyOn(component, 'toggleNav').and.callThrough();
    });

    afterAll(() => {
        cleanStylesFromDOM();
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    it('... injected service should use provided mockValue', () => {
        const coreService = TestBed.inject(CoreService);
        expectToBe(mockCoreService === coreService, true);
    });

    describe('BEFORE initial data binding', () => {
        it('... should have fontawesome icons', () => {
            expectToEqual(component.faEnvelope, expectedContactIcon);

            expectToEqual(component.faFileAlt, expectedEditionIcon);

            expectToEqual(component.faHome, expectedHomeIcon);

            expectToEqual(component.faNetworkWired, expectedStructureIcon);

            expectToEqual(component.faSearch, expectedSearchIcon);
        });

        it('... should have `isCollapsed = true`', () => {
            expectToBe(component.isCollapsed, true);
        });

        it('... should have `DISPLAYED_EDITION_COMPLEXES`', () => {
            expectToEqual(component.DISPLAYED_EDITION_COMPLEXES, expectedEditionComplexes);
        });

        it('... should have as many `DISPLAYED_EDITION_COMPLEXES` as there are complexes in the array', () => {
            expectToEqual(component.DISPLAYED_EDITION_COMPLEXES.length, expectedEditionComplexes.length);
        });

        it('... should have `editionRouteConstants`', () => {
            expectToBe(component.editionRouteConstants, expectedEditionRouteConstants);
        });

        it('... should not have `logos`', () => {
            expect(component.logos).toBeUndefined();
        });

        describe('VIEW', () => {
            it('... should contain 1 navbar', () => {
                getAndExpectDebugElementByCss(compDe, 'nav.navbar', 1, 1);
            });

            it('... should contain 2 navbar-brand-container with links in navbar', () => {
                const navbarDe = getAndExpectDebugElementByCss(compDe, 'nav.navbar', 1, 1);
                getAndExpectDebugElementByCss(navbarDe[0], '.navbar-brand-container > a.navbar-brand', 2, 2);
            });

            it('... should display first navbar-brand link not on sm devices, and second navbar-brand link only on sm devices', () => {
                const navbarDe = getAndExpectDebugElementByCss(compDe, 'nav.navbar', 1, 1);
                const navbarBrandDes = getAndExpectDebugElementByCss(navbarDe[0], '.navbar-brand-container', 2, 2);

                const navbarBrandEl1 = navbarBrandDes[0].nativeElement;
                const navbarBrandEl2 = navbarBrandDes[1].nativeElement;

                expectToContain(navbarBrandEl1.classList, 'd-sm-none');
                expectToContain(navbarBrandEl1.classList, 'd-md-inline');

                expectToContain(navbarBrandEl2.classList, 'd-sm-inline');
                expectToContain(navbarBrandEl2.classList, 'd-md-none');
            });

            it('... should not render awg project url in navbar-brand link yet', () => {
                const urlDes = getAndExpectDebugElementByCss(compDe, 'a.navbar-brand', 2, 2);
                const urlEl1 = urlDes[0].nativeElement;
                const urlEl2 = urlDes[1].nativeElement;

                expectToBe(urlEl1.href, '');
                expectToBe(urlEl2.href, '');
            });

            it('... should contain 1 toggle button in navbar', () => {
                const navbarDe = getAndExpectDebugElementByCss(compDe, 'nav.navbar', 1, 1);
                getAndExpectDebugElementByCss(navbarDe[0], 'button.navbar-toggler', 1, 1);
            });

            it('... should contain 1 navbar collapse in navbar', () => {
                const navbarDe = getAndExpectDebugElementByCss(compDe, 'nav.navbar', 1, 1);
                getAndExpectDebugElementByCss(navbarDe[0], 'div.navbar-collapse', 1, 1);
            });

            it('... should contain 2 ul.navbar-nav in navbar collapse', () => {
                const navbarCollapseDe = getAndExpectDebugElementByCss(compDe, 'div.navbar-collapse', 1, 1);
                getAndExpectDebugElementByCss(navbarCollapseDe[0], 'ul.navbar-nav', 2, 2);
            });

            it('... should contain 3 nav-items in first ul.navbar-nav, and 2 nav-items in second ul.navbar-nav', () => {
                const navbarCollapseDe = getAndExpectDebugElementByCss(compDe, 'div.navbar-collapse', 1, 1);
                const ulDe = getAndExpectDebugElementByCss(navbarCollapseDe[0], 'ul.navbar-nav', 2, 2);

                getAndExpectDebugElementByCss(ulDe[0], 'li.nav-item', 3, 3);
                getAndExpectDebugElementByCss(ulDe[1], 'li.nav-item', 2, 2);
            });

            it('... should have `awg-app` label and fa-icon on first nav-item link', () => {
                const navItemDe = getAndExpectDebugElementByCss(compDe, 'li.nav-item', 5, 5);
                const navItemLinkSpanDe = getAndExpectDebugElementByCss(navItemDe[0], 'a.nav-link > span', 2, 2);
                const navItemLinkSpanEl1 = navItemLinkSpanDe[0].nativeElement;
                const navItemLinkSpanEl2 = navItemLinkSpanDe[1].nativeElement;

                expectToBe(navItemLinkSpanEl1.textContent, 'awg-app');

                expectToBe(navItemLinkSpanEl2.textContent, '(current)');
                expectToContain(navItemLinkSpanEl2.classList, 'sr-only');

                getAndExpectDebugElementByCss(navItemDe[0], 'a.nav-link > fa-icon', 1, 1);
            });

            it('... should have `Edition` label and fa-icon on second nav-item link', () => {
                const navItemDe = getAndExpectDebugElementByCss(compDe, 'li.nav-item', 5, 5);
                const navItemLinkSpanDe = getAndExpectDebugElementByCss(navItemDe[1], 'a.nav-link > span', 1, 1);
                const navItemLinkSpanEl = navItemLinkSpanDe[0].nativeElement;

                expectToBe(navItemLinkSpanEl.textContent, 'Edition');

                getAndExpectDebugElementByCss(navItemDe[1], 'a.nav-link > fa-icon', 1, 1);
            });

            it('... should have `Strukturmodell` label and fa-icon on third nav-item link', () => {
                const navItemDe = getAndExpectDebugElementByCss(compDe, 'li.nav-item', 5, 5);
                const navItemLinkSpanDe = getAndExpectDebugElementByCss(navItemDe[2], 'a.nav-link > span', 1, 1);
                const navItemLinkSpanEl = navItemLinkSpanDe[0].nativeElement;

                expectToBe(navItemLinkSpanEl.textContent, 'Strukturmodell');

                getAndExpectDebugElementByCss(navItemDe[2], 'a.nav-link > fa-icon', 1, 1);
            });

            it('... should have `Suche` label and fa-icon on fourth nav-item link', () => {
                const navItemDe = getAndExpectDebugElementByCss(compDe, 'li.nav-item', 5, 5);
                const navItemLinkSpanDe = getAndExpectDebugElementByCss(navItemDe[3], 'a.nav-link > span', 1, 1);
                const navItemLinkSpanEl = navItemLinkSpanDe[0].nativeElement;

                expectToBe(navItemLinkSpanEl.textContent, 'Suche');

                getAndExpectDebugElementByCss(navItemDe[3], 'a.nav-link > fa-icon', 1, 1);
            });

            it('... should have `Kontakt` label and fa-icon on fifth nav-item link', () => {
                const navItemDe = getAndExpectDebugElementByCss(compDe, 'li.nav-item', 5, 5);
                const navItemLinkSpanDe = getAndExpectDebugElementByCss(navItemDe[4], 'a.nav-link > span', 1, 1);
                const navItemLinkSpanEl = navItemLinkSpanDe[0].nativeElement;

                expectToBe(navItemLinkSpanEl.textContent, 'Kontakt');

                getAndExpectDebugElementByCss(navItemDe[4], 'a.nav-link > fa-icon', 1, 1);
            });
        });

        describe('#isActiveRoute()', () => {
            it('... should have a method `isActiveRoute`', () => {
                expect(component.isActiveRoute).toBeDefined();
            });

            it('... should not have been called', () => {
                expectSpyCall(isActiveRouteSpy, 0);
            });
        });

        describe('#provideMetaData()', () => {
            it('... should have a method `provideMetaData`', () => {
                expect(component.provideMetaData).toBeDefined();
            });

            it('... should not have been called', () => {
                expectSpyCall(provideMetaDataSpy, 0);
            });

            it('... should not have `logos`', () => {
                expect(component.logos).toBeUndefined();
            });
        });

        describe('#toggleNav()', () => {
            it('... should have a method `toggleNav`', () => {
                expect(component.toggleNav).toBeDefined();
            });

            it('... should not have been called', () => {
                expectSpyCall(toggleNavSpy, 0);
            });

            it('... should be called when navbar toggle button clicked (click helper)', () => {
                // Find button elements
                const buttonDes = getAndExpectDebugElementByCss(compDe, 'button.navbar-toggler', 1, 1);
                const buttonEl = buttonDes[0].nativeElement;

                // Should have not been called yet
                expectSpyCall(toggleNavSpy, 0);

                // Click button
                click(buttonDes[0]);
                click(buttonEl);

                expectSpyCall(toggleNavSpy, 2);
            });

            it('... should toggle `isCollapsed`', () => {
                component.toggleNav();

                expectToBe(component.isCollapsed, false);

                component.toggleNav();

                expectToBe(component.isCollapsed, true);

                component.toggleNav();

                expectToBe(component.isCollapsed, false);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Trigger initial data binding
            fixture.detectChanges();
        });

        describe('VIEW', () => {
            it('... should render awg project url in navbar-brand link', () => {
                const urlDes = getAndExpectDebugElementByCss(compDe, 'a.navbar-brand', 2, 2);
                const urlEl1 = urlDes[0].nativeElement;
                const urlEl2 = urlDes[1].nativeElement;

                expectToBe(urlEl1.href, expectedLogos['awg'].href);
                expectToBe(urlEl2.href, expectedLogos['awg'].href);
            });

            it('... should display home icon in first nav-item link ', () => {
                const navItemDe = getAndExpectDebugElementByCss(compDe, 'li.nav-item', 5, 5);
                const faIconDe = getAndExpectDebugElementByCss(navItemDe[0], 'a.nav-link > fa-icon', 1, 1);
                const faIconIns = faIconDe[0].componentInstance.icon;

                expectToEqual(faIconIns, expectedHomeIcon);
            });

            it('... should display edition icon in second nav-item link ', () => {
                const navItemDe = getAndExpectDebugElementByCss(compDe, 'li.nav-item', 5, 5);
                const faIconDe = getAndExpectDebugElementByCss(navItemDe[1], 'a.nav-link > fa-icon', 1, 1);
                const faIconIns = faIconDe[0].componentInstance.icon;

                expectToEqual(faIconIns, expectedEditionIcon);
            });

            it('... should display structure icon in third nav-item link ', () => {
                const navItemDe = getAndExpectDebugElementByCss(compDe, 'li.nav-item', 5, 5);
                const faIconDe = getAndExpectDebugElementByCss(navItemDe[2], 'a.nav-link > fa-icon', 1, 1);
                const faIconIns = faIconDe[0].componentInstance.icon;

                expectToEqual(faIconIns, expectedStructureIcon);
            });

            it('... should display search icon in fourth nav-item link ', () => {
                const navItemDe = getAndExpectDebugElementByCss(compDe, 'li.nav-item', 5, 5);
                const faIconDe = getAndExpectDebugElementByCss(navItemDe[3], 'a.nav-link > fa-icon', 1, 1);
                const faIconIns = faIconDe[0].componentInstance.icon;

                expectToEqual(faIconIns, expectedSearchIcon);
            });

            it('... should display contact icon in fifth nav-item link ', () => {
                const navItemDe = getAndExpectDebugElementByCss(compDe, 'li.nav-item', 5, 5);
                const faIconDe = getAndExpectDebugElementByCss(navItemDe[4], 'a.nav-link > fa-icon', 1, 1);
                const faIconIns = faIconDe[0].componentInstance.icon;

                expectToEqual(faIconIns, expectedContactIcon);
            });

            describe('... second nav-item link (edition)', () => {
                let navItemDe: DebugElement[];
                let navItemLinkDe: DebugElement[];

                beforeEach(fakeAsync(() => {
                    navItemDe = getAndExpectDebugElementByCss(compDe, 'li.nav-item', 5, 5);
                    navItemLinkDe = getAndExpectDebugElementByCss(navItemDe[1], 'a.nav-link', 1, 1);

                    // Click on second nav-item link
                    clickAndAwaitChanges(navItemLinkDe[0], fixture);
                }));

                it('... should have a dropdown menu', () => {
                    getAndExpectDebugElementByCss(navItemDe[1], 'div.dropdown-menu', 1, 1);
                });

                it('... should have a dropdown header `Allgemein` as first child', () => {
                    const headerDe = getAndExpectDebugElementByCss(
                        navItemDe[1],
                        'div.dropdown-menu > h6.dropdown-header:nth-child(1)',
                        1,
                        1
                    );
                    const headerEl = headerDe[0].nativeElement;

                    expectToBe(headerEl.textContent, 'Allgemein');
                });

                it('... should be followed by 3 dropdown items for edition overview, rowtables and preface', () => {
                    const overviewDe = getAndExpectDebugElementByCss(
                        navItemDe[1],
                        'div.dropdown-menu > a.dropdown-item:nth-child(2)',
                        1,
                        1
                    );
                    const rowtablesDe = getAndExpectDebugElementByCss(
                        navItemDe[1],
                        'div.dropdown-menu > a.dropdown-item:nth-child(3)',
                        1,
                        1
                    );
                    const prefaceDe = getAndExpectDebugElementByCss(
                        navItemDe[1],
                        'div.dropdown-menu > a.dropdown-item:nth-child(4)',
                        1,
                        1
                    );

                    const overviewEl = overviewDe[0].nativeElement;
                    const rowtablesEl = rowtablesDe[0].nativeElement;
                    const prefaceEl = prefaceDe[0].nativeElement;

                    expectToBe(overviewEl.textContent, EDITION_ROUTE_CONSTANTS.SERIES.full);
                    expectToBe(rowtablesEl.textContent, EDITION_ROUTE_CONSTANTS.ROWTABLES.full);
                    expectToBe(prefaceEl.textContent, EDITION_ROUTE_CONSTANTS.PREFACE.full);
                });

                it('... should have another dropdown header `Auswahl Skizzenkomplexe` surrounded by dividers', () => {
                    getAndExpectDebugElementByCss(
                        navItemDe[1],
                        'div.dropdown-menu > div.dropdown-divider:nth-child(5)',
                        1,
                        1
                    );
                    const headerDe = getAndExpectDebugElementByCss(
                        navItemDe[1],
                        'div.dropdown-menu > h6.dropdown-header:nth-child(6)',
                        1,
                        1
                    );
                    const headerEl = headerDe[0].nativeElement;

                    getAndExpectDebugElementByCss(
                        navItemDe[1],
                        'div.dropdown-menu > div.dropdown-divider:nth-child(7)',
                        1,
                        1
                    );

                    expectToBe(headerEl.textContent, 'Auswahl Skizzenkomplexe');
                });

                it('... should be followed by as many `div.awg-dropdown-complexes` as edition complexes are available', () => {
                    const divDe = getAndExpectDebugElementByCss(
                        navItemDe[1],
                        'div.dropdown-menu > div.awg-dropdown-complexes',
                        expectedEditionComplexes.length,
                        expectedEditionComplexes.length
                    );
                });

                it('... should display a header and a list of 3 dropdown items for each dropdown complex', () => {
                    const divDe = getAndExpectDebugElementByCss(
                        navItemDe[1],
                        'div.dropdown-menu > div.awg-dropdown-complexes',
                        expectedEditionComplexes.length,
                        expectedEditionComplexes.length
                    );

                    // Expect header and 3 dropdown items for each dropdown complex
                    divDe.forEach(complexDe => {
                        getAndExpectDebugElementByCss(complexDe, 'h6.dropdown-header', 1, 1);
                        getAndExpectDebugElementByCss(complexDe, 'a.dropdown-item', 3, 3);
                    });
                });

                it('... should display correct header for each dropdown complex', () => {
                    const divDe = getAndExpectDebugElementByCss(
                        navItemDe[1],
                        'div.dropdown-menu > div.awg-dropdown-complexes',
                        expectedEditionComplexes.length,
                        expectedEditionComplexes.length
                    );

                    divDe.forEach((complexDe, index) => {
                        const headerDe = getAndExpectDebugElementByCss(complexDe, 'h6.dropdown-header', 1, 1);
                        const headerEl = headerDe[0].nativeElement;

                        const headerSpanDe = getAndExpectDebugElementByCss(headerDe[0], 'span', 1, 1);
                        const headerSpanEl = headerSpanDe[0].nativeElement;

                        const awg = EDITION_ROUTE_CONSTANTS.EDITION.short;
                        const series = expectedEditionComplexes[index].pubStatement.series.short;
                        const section = expectedEditionComplexes[index].pubStatement.section.short;

                        const headerSiglum = `[${awg} ${series}/${section}] `;
                        const headerId = expectedEditionComplexes[index].complexId.full;

                        expectToContain(headerEl.textContent, headerSiglum);
                        expectToBe(headerSpanEl.innerHTML.trim(), headerId.trim());
                    });
                });

                it('... should display correct dropdown item labels for each dropdown complex', () => {
                    const divDe = getAndExpectDebugElementByCss(
                        navItemDe[1],
                        'div.dropdown-menu > div.awg-dropdown-complexes',
                        expectedEditionComplexes.length,
                        expectedEditionComplexes.length
                    );

                    // Expect header and 3 dropdown items for each dropdown complex
                    divDe.forEach((complexDe, index) => {
                        const itemsDe = getAndExpectDebugElementByCss(complexDe, 'a.dropdown-item', 3, 3);
                        const itemsEl1 = itemsDe[0].nativeElement;
                        const itemsEl2 = itemsDe[1].nativeElement;
                        const itemsEl3 = itemsDe[2].nativeElement;

                        expectToBe(itemsEl1.textContent, EDITION_ROUTE_CONSTANTS.EDITION_INTRO.full);
                        expectToBe(itemsEl2.textContent, EDITION_ROUTE_CONSTANTS.EDITION_SHEETS.full);
                        expectToBe(itemsEl3.textContent, EDITION_ROUTE_CONSTANTS.EDITION_REPORT.full);
                    });
                });
            });
        });

        describe('#isActiveRoute()', () => {
            it('... should have been called 2 times', () => {
                expectSpyCall(isActiveRouteSpy, 2);
            });

            it('... should return true if a given route is active', () => {
                const expectedActiveRoute = '/active-route';
                routerSpy.and.returnValue(true);

                expectToBe(component.isActiveRoute(expectedActiveRoute), true);
            });

            it('... should return false if a given route is not active', () => {
                const expectedActiveRoute = '/non-active-route';
                routerSpy.and.returnValue(false);

                expectToBe(component.isActiveRoute(expectedActiveRoute), false);
            });
        });

        describe('#provideMetaData()', () => {
            it('... should have been called', () => {
                expectSpyCall(provideMetaDataSpy, 1);
            });

            it('... should get `logos`', () => {
                expectToEqual(component.logos, expectedLogos);
            });

            it('... should have called coreService', () => {
                expectSpyCall(coreServiceSpy, 1);
            });
        });

        describe('[routerLink]', () => {
            beforeEach(() => {
                // Find DebugElements with an attached RouterLinkStubDirective
                linkDes = getAndExpectDebugElementByDirective(
                    compDe,
                    RouterLinkStubDirective,
                    expectedOrderOfRouterlinks.length,
                    expectedOrderOfRouterlinks.length
                );

                // Get attached link directive instances using each DebugElement's injector
                routerLinks = linkDes.map(de => de.injector.get(RouterLinkStubDirective));
            });

            it('... can get correct numer of routerLinks from template', () => {
                expectToBe(routerLinks.length, expectedOrderOfRouterlinks.length);
            });

            it('... can get correct linkParams from template', () => {
                routerLinks.forEach((routerLink, index) => {
                    expectToEqual(routerLink.linkParams, expectedOrderOfRouterlinks[index]);
                });
            });

            it('... can click all links in template', () => {
                routerLinks.forEach((routerLink, index) => {
                    const linkDe = linkDes[index];
                    const expectedRouterLink = expectedOrderOfRouterlinks[index];

                    expectToBe(routerLink.navigatedTo, null);

                    click(linkDe);
                    fixture.detectChanges();

                    expectToEqual(routerLink.navigatedTo, expectedRouterLink);
                });
            });
        });
    });
});
