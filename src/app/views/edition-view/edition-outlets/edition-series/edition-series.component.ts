import { Component, OnInit } from '@angular/core';

import { EditionOutlineSeries } from '@awg-views/edition-view/models';
import { EditionOutlineService, EditionService } from '@awg-views/edition-view/services';

/**
 * The EditionSeries component.
 *
 * It contains the series section
 * of the edition view of the app.
 */
@Component({
    selector: 'awg-edition-series',
    templateUrl: './edition-series.component.html',
    styleUrls: ['./edition-series.component.scss'],
})
export class EditionSeriesComponent implements OnInit {
    /**
     * Public variable: editionOutline.
     *
     * It keeps the outline of the edition as an array of routes.
     */
    editionOutline: EditionOutlineSeries[];

    /**
     * Constructor of the EditionSeriesComponent.
     *
     * It declares a private instance of the EditionService.
     *
     * @param {EditionService} editionService Instance of the EditionService.
     */
    constructor(private editionService: EditionService) {
        // Intentionally left empty until implemented
    }

    /**
     * Angular life cycle hook: ngOnInit.
     *
     * It calls the containing methods
     * when initializing the component.
     */
    ngOnInit() {
        this.clearSelections();
        this.getEditionOutline();
    }

    /**
     * Public method: clearSelectedSeries.
     *
     * It clears the selected series from the EditionService.
     *
     * @returns {void} Clears the edition series.
     */
    clearSelections(): void {
        this.editionService.clearSelectedEditionSeries();
        this.editionService.clearSelectedEditionSection();
    }

    /**
     * Public method: getEditionOutline.
     *
     * It gets the outline with array of series from the EditionService.
     *
     * @returns {void} Gets the edition outline.
     */
    getEditionOutline(): void {
        this.editionOutline = EditionOutlineService.getEditionOutline();
    }
}
