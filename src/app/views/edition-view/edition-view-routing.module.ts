import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EditionViewComponent } from './edition-view.component';
import { EditionComplexComponent } from './edition-outlets/edition-complex';
import { EditionDetailNavComponent } from './edition-outlets/edition-complex/edition-detail/edition-detail-nav/edition-detail-nav.component';
import { EditionSectionsComponent } from './edition-outlets/edition-series-detail/edition-sections';
import { EditionSectionDetailComponent } from './edition-outlets/edition-series-detail/edition-section-detail';
import { EditionSeriesComponent } from './edition-outlets/edition-series';
import { EditionSeriesDetailComponent } from './edition-outlets/edition-series-detail';
import { EditionTypeComponent } from './edition-outlets/edition-type';

/* Routes of the EditionViewModule */
const EDITION_VIEW_ROUTES: Routes = [
    {
        path: '',
        component: EditionViewComponent,
        children: [
            {
                // Overview of series.
                path: 'series',
                component: EditionSeriesComponent,
            },
            {
                // Series by id (I, II, III).
                path: 'series/:id',
                component: EditionSeriesDetailComponent,
                children: [
                    {
                        path: 'sections',
                        component: EditionSectionsComponent,
                    },
                    {
                        path: 'section/:id',
                        component: EditionSectionDetailComponent,
                    },
                    {
                        path: 'sections/:id',
                        redirectTo: 'section/:id',
                        pathMatch: 'full',
                    },
                    {
                        path: '',
                        redirectTo: 'sections',
                        pathMatch: 'full',
                    },
                ],
            },
            {
                // CompositionID (op12, M317, etc.).
                path: 'composition/:compositionId',
                component: EditionComplexComponent,
                children: [
                    {
                        path: '',
                        component: EditionDetailNavComponent,
                        children: [
                            {
                                path: 'intro',
                                loadChildren: () =>
                                    import(
                                        './edition-outlets/edition-complex/edition-detail/edition-intro/edition-intro.module'
                                    ).then(m => m.EditionIntroModule),
                            },
                            {
                                path: 'sheets',
                                loadChildren: () =>
                                    import(
                                        './edition-outlets/edition-complex/edition-detail//edition-sheets/edition-sheets.module'
                                    ).then(m => m.EditionSheetsModule),
                            },
                            {
                                path: 'report',
                                loadChildren: () =>
                                    import(
                                        './edition-outlets/edition-complex/edition-detail//edition-report/edition-report.module'
                                    ).then(m => m.EditionReportModule),
                            },
                            {
                                path: 'graph',
                                loadChildren: () =>
                                    import(
                                        './edition-outlets/edition-complex/edition-detail//edition-graph/edition-graph.module'
                                    ).then(m => m.EditionGraphModule),
                            },
                            {
                                path: '',
                                redirectTo: 'intro',
                                pathMatch: 'full',
                            },
                        ],
                    },
                ],
            },
            {
                // Overview of row tables.
                path: 'row-tables',
                loadChildren: () =>
                    import('./edition-outlets/edition-row-tables/edition-row-tables.module').then(
                        m => m.EditionRowTablesModule
                    ),
            },
        ],
    },
];

/**
 * Routed components of the {@link EditionViewModule}:
 * {@link EditionViewComponent}, {@link EditionDetailNavComponent},
 * {@link EditionSectionsComponent}, {@link EditionSeriesComponent}
 * and {@link EditionTypeComponent}.
 */
export const routedEditionViewComponents = [
    EditionViewComponent,
    EditionComplexComponent,
    EditionDetailNavComponent,
    EditionSectionsComponent,
    EditionSectionDetailComponent,
    EditionSeriesComponent,
    EditionSeriesDetailComponent,
    EditionTypeComponent,
];

/**
 * EditionView module routing.
 *
 * It activates the EDITION_VIEW_ROUTES.
 */
@NgModule({
    imports: [RouterModule.forChild(EDITION_VIEW_ROUTES)],
    exports: [RouterModule],
})
export class EditionViewRoutingModule {}
