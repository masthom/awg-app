import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

import { combineLatest, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith } from 'rxjs/operators';

import { faSortDown, faSortUp } from '@fortawesome/free-solid-svg-icons';

import {
    PaginatorOptions,
    SelectResponse,
    SelectResponseBindings,
    TableData,
    TableOptions,
    TableOptionsSortCase,
} from '../models';

/**
 * The SparqlTable component.
 *
 * It contains the SPARQL table for SELECT queries
 * of the {@link GraphVisualizerComponent}.
 */
@Component({
    selector: 'awg-sparql-table',
    templateUrl: './sparql-table.component.html',
    styleUrls: ['./sparql-table.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SparqlTableComponent implements OnInit {
    /**
     * Input variable: queryResult$.
     *
     * It keeps the SelectResponse as an observable.
     */
    @Input()
    queryResult: SelectResponse;

    /**
     * Input variable: queryTime.
     *
     * It keeps the duration time of the query.
     */
    @Input()
    queryTime: number;

    /**
     * Output variable: clickedTableRequest.
     *
     * It keeps an event emitter for a click on a table IRI.
     */
    @Output()
    clickedTableRequest: EventEmitter<string> = new EventEmitter();

    /**
     * Public variable: faSortUp.
     *
     * It instantiates fontawesome's faSortUp icon.
     */
    faSortUp = faSortUp;

    /**
     * Public variable: faSortDown.
     *
     * It instantiates fontawesome's faSortDown icon.
     */
    faSortDown = faSortDown;

    /**
     * Public variable: paginatorOptions.
     *
     * It keeps the options of the Paginator.
     */
    paginatorOptions: PaginatorOptions;

    /**
     * Public variable: tableData.
     *
     * It keeps the data arrays of the table.
     */
    tableData: TableData;

    /**
     * Public variable: tableOptions.
     *
     * It keeps the options of the table.
     */
    tableOptions: TableOptions = {
        selectedKey: '',
        sortKey: '',
        sortIcon: this.faSortDown,
        reverse: false,
        case: TableOptionsSortCase.CASE_INSENSITIVE,
    };

    /**
     * Public variable: searchFilter.
     *
     * It keeps the form control of the search filter.
     */
    searchFilter: FormControl;

    /**
     * Public variable: searchFilter$.
     *
     * It keeps an observable of the search filter values.
     */
    searchFilter$: Observable<string>;

    /**
     * Angular life cycle hook: ngOnInit.
     *
     * It calls the containing methods
     * when initializing the component.
     */
    ngOnInit(): void {
        this._initTable();
    }

    /**
     * Public method: onPageSizeChange.
     *
     * It emits the new start position of the Paginator
     * from a given page number to the {@link pageChangeRequest}.
     *
     * @returns {void} Emits the new start position.
     */
    onPageSizeChange(): void {
        if (!this.queryResult) {
            return;
        }
        this.tableData.filteredRows$ = this._filterRows();

        this.tableData.paginatedRows$ = this._paginateRows();
    }

    /**
     * Public method: onSort.
     *
     * It sets the options to sort a table column by a given sort key (header label).
     *
     * @param {string} key The given key to sort by.
     *
     * @returns {void} Sets the options.
     */
    onSort(key: string): void {
        if (!key) {
            return;
        }

        // Switch sort order when clicking on same key
        if (this.tableOptions.selectedKey === key) {
            this.tableOptions.reverse = !this.tableOptions.reverse;
        }

        // Set sort icon
        this.tableOptions.sortIcon = this.tableOptions.reverse ? this.faSortUp : this.faSortDown;

        // Select new key
        this.tableOptions.selectedKey = key;

        // Create sortKey for nested object
        this.tableOptions.sortKey = this.tableOptions.selectedKey.toString() + '.label';
    }

    /**
     * Public method: onTableNodeClick.
     *
     * It emits a uri the user clicked on in the result table.
     *
     * @param {string} uri The given uri.
     *
     * @returns {void} Emits the uri.
     */
    onTableNodeClick(uri: string): void {
        if (!uri) {
            return;
        }
        this.clickedTableRequest.emit(uri);
    }

    /**
     * Private method: _initTable.
     *
     * It inits all the data needed for the table.
     *
     * @returns {void} Inits the table data.
     */
    private _initTable(): void {
        this.tableData = new TableData(this.queryResult);
        this.paginatorOptions = new PaginatorOptions(
            1,
            10,
            [5, 10, 25, 50, 100, 200],
            this.queryResult.body.bindings.length
        );

        this._initFilter();

        this.onSort(this.tableData.header[0]);

        this.onPageSizeChange();
    }

    /**
     * Private method: _initFilter.
     *
     * It inits all the data needed for the table.
     *
     * @returns {void} Inits the table data.
     */
    private _initFilter(): void {
        this.searchFilter = new FormControl('');
        this.searchFilter$ = this.searchFilter.valueChanges.pipe(
            // Start with empty string
            startWith(''),
            // Do not check changes before half a second
            debounceTime(500),
            // Do not check unchanged values
            distinctUntilChanged()
        );
    }

    /**
     * Private method: _filterRows.
     *
     * It returns a combined observable with the filtered table rows.
     *
     * @returns {Observable<any[]>} Returns a combined observable.
     */
    private _filterRows(): Observable<any[]> {
        return combineLatest(this.tableData.totalRows$, this.searchFilter$).pipe(
            map(([rows, filterTerm]) => {
                const term = filterTerm.toString().toLowerCase();
                return rows.filter(row =>
                    Object.values(row).some(rowEntry => {
                        if (rowEntry === null || rowEntry === undefined) {
                            return false;
                        }
                        return rowEntry['label'] && rowEntry['label'].toString().toLowerCase().includes(term);
                    })
                );
            })
        );
    }
    /**
     * Private method: _paginateRows.
     *
     * It returns a sliced observable with the paginated table rows.
     *
     * @returns {Observable<SelectResponseBindings[]>} Returns an observable of the paginated rows.
     */
    private _paginateRows(): Observable<SelectResponseBindings[]> {
        const startRow = (this.paginatorOptions.page - 1) * this.paginatorOptions.pageSize;
        const endRow = startRow + this.paginatorOptions.pageSize;
        const range = endRow - startRow;

        return this.tableData.filteredRows$.pipe(
            map(rows => {
                if (rows.length <= range) {
                    return rows;
                } else {
                    return rows.slice(startRow, endRow);
                }
            })
        );
    }
}