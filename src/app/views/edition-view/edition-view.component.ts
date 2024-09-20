import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { delay, Observable } from 'rxjs';

import { EDITION_ROUTE_CONSTANTS } from '@awg-views/edition-view/edition-route-constants';
import { EditionComplex, EditionOutlineSection, EditionOutlineSeries } from '@awg-views/edition-view/models';
import { EditionService } from '@awg-views/edition-view/services';

/**
 * The EditionView component.
 *
 * It contains the edition view section of the app
 * with a {@link HeadingComponent} and
 * another router outlet for the edition routes.
 */
@Component({
    selector: 'awg-edition-view',
    templateUrl: './edition-view.component.html',
    styleUrls: ['./edition-view.component.scss'],
})
export class EditionViewComponent implements OnInit {
    /**
     * Public variable: editionViewTitle
     *
     * It keeps the title of the edition view section.
     */
    editionViewTitle = 'Inhalt';

    /**
     * Public variable: editionViewId.
     *
     * It keeps the id of the edition view section.
     */
    editionViewId = 'awg-edition-view';

    /**
     * Public variable: isIntroView$.
     *
     * Observable that keeps the information
     * about the flag for the intro view.
     */
    isIntroView$: Observable<boolean>;

    /**
     * Public variable: isPrefaceView$.
     *
     * Observable that keeps the information
     * about the flag for the preface view.
     */
    isPrefaceView$: Observable<boolean>;

    /**
     * Public variable: isRowTableView$.
     *
     * Observable that keeps the information
     * about the flag for the row table view.
     */
    isRowTableView$: Observable<boolean>;

    /**
     * Public variable: selectedEditionComplex$.
     *
     * Observable that keeps the information
     * about the current edition complex.
     */
    selectedEditionComplex$: Observable<EditionComplex>;

    /**
     * Public variable: selectedEditionSection$.
     *
     * It keeps the selected section of the edition as an Observable of EditionOutlineSection.
     */
    selectedEditionSection$: Observable<EditionOutlineSection>;

    /**
     * Public variable: selectedEditionSeries$.
     *
     * It keeps the selected series of the edition as an Observable of EditionOutlineSeries.
     */
    selectedEditionSeries$: Observable<EditionOutlineSeries>;

    /**
     * Constructor of the EditionViewComponent.
     *
     * It declares private instances of
     * EditionService, ActivatedRoute and Router.
     *
     * @param {EditionService} editionService Instance of the EditionService.
     * @param {Router} router Instance of the Angular router.
     */
    constructor(
        private editionService: EditionService,
        private router: Router
    ) {}

    /**
     * Getter variable: editionRouteConstants.
     *
     *  It returns the EDITION_ROUTE_CONSTANTS.
     **/
    get editionRouteConstants(): typeof EDITION_ROUTE_CONSTANTS {
        return EDITION_ROUTE_CONSTANTS;
    }

    /**
     * Angular life cycle hook: ngOnInit.
     *
     * It calls the containing methods
     * when initializing the component.
     */
    ngOnInit() {
        this.setupEditionView();
        this.routeToSidenav();
    }

    /**
     * Public method: setupEditionView.
     *
     * It sets up the edition view by loading
     * the selected series, section, and edition complex
     * from the edition service.
     *
     * @returns {void} Sets up the edition view.
     */
    setupEditionView(): void {
        this.selectedEditionSeries$ = this.editionService.getSelectedEditionSeries().pipe(delay(0));
        this.selectedEditionSection$ = this.editionService.getSelectedEditionSection().pipe(delay(0));
        this.selectedEditionComplex$ = this.editionService.getSelectedEditionComplex().pipe(delay(0));
        this.isIntroView$ = this.editionService.getIsIntroView().pipe(delay(0));
        this.isPrefaceView$ = this.editionService.getIsPrefaceView().pipe(delay(0));
        this.isRowTableView$ = this.editionService.getIsRowTableView().pipe(delay(0));
    }

    /**
     * Public method: routeToSidenav.
     *
     * It activates the secondary outlet with the edition-info.
     *
     * @returns {void} Activates the edition-info side outlet.
     */
    routeToSidenav(): void {
        // Opens the side-info outlet while preserving the router fragment for scrolling
        this.router.navigate([{ outlets: { side: 'editionInfo' } }], {
            preserveFragment: true,
        });
    }
}
