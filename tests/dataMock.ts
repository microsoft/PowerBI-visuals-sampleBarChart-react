import powerbi from "powerbi-visuals-api";
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;

import { VisualState } from "../src/dataInterfaces";

export const mockState: VisualState = {
    measures: [
        {
            index: 0,
            formatter: { options: { format: "0", precision: 2, value: 0 } },
            queryName: "Sum(Level By Team.Credit)",
            color: "#01B8AA",
            displayName: "Credit",
            maxValue: 43,
            minValue: 9
        },
        {
            index: 1,
            formatter: { options: { format: "0", precision: 2, value: 0 } },
            queryName: "Sum(Level By Team.Level)",
            color: "#5555FF",
            displayName: "Level",
            maxValue: 5,
            minValue: 1
        }
    ],
    entries: [
        {
            dataPoints: [
                { measureIndex: 0, value: 43, displayValue: "43.00" },
                { measureIndex: 1, value: 1, displayValue: "1.00" }
            ],
            index: 0,
            sum: 44,
            name: "Eccentric Fighters"
        },
        {
            dataPoints: [
                { measureIndex: 0, value: 41, displayValue: "41.00" },
                { measureIndex: 1, value: 1, displayValue: "1.00" }
            ],
            index: 1,
            sum: 42,
            name: "Blue Warriors"
        },
        {
            dataPoints: [
                { measureIndex: 0, value: 33, displayValue: "33.00" },
                { measureIndex: 1, value: 3, displayValue: "3.00" }
            ],
            index: 2,
            sum: 36,
            name: "American Lightning"
        },
        {
            dataPoints: [
                { measureIndex: 0, value: 32, displayValue: "32.00" },
                { measureIndex: 1, value: 2, displayValue: "2.00" }
            ],
            index: 3,
            sum: 34,
            name: "Alpha Monkeys"
        },
        {
            dataPoints: [
                { measureIndex: 0, value: 23, displayValue: "23.00" },
                { measureIndex: 1, value: 3, displayValue: "3.00" }
            ],
            index: 4,
            sum: 26,
            name: "Spinning Sharpshooters"
        },
        {
            dataPoints: [
                { measureIndex: 0, value: 22, displayValue: "22.00" },
                { measureIndex: 1, value: 3, displayValue: "3.00" }
            ],
            index: 5,
            sum: 25,
            name: "Infamous Assassins"
        },
        {
            dataPoints: [
                { measureIndex: 0, value: 22, displayValue: "22.00" },
                { measureIndex: 1, value: 2, displayValue: "2.00" }
            ],
            index: 6,
            sum: 24,
            name: "Xtreme Chuckers"
        },
        {
            dataPoints: [
                { measureIndex: 0, value: 12, displayValue: "12.00" },
                { measureIndex: 1, value: 5, displayValue: "5.00" }
            ],
            index: 7,
            sum: 17,
            name: "Boston Widows"
        },
        {
            dataPoints: [
                { measureIndex: 0, value: 12, displayValue: "12.00" },
                { measureIndex: 1, value: 4, displayValue: "4.00" }
            ],
            index: 8,
            sum: 16,
            name: "Butterfly Drivers"
        },
        {
            dataPoints: [
                { measureIndex: 0, value: 12, displayValue: "12.00" },
                { measureIndex: 1, value: 1, displayValue: "1.00" }
            ],
            index: 9,
            sum: 13,
            name: "Extreme Dynamos"
        },
        {
            dataPoints: [
                { measureIndex: 0, value: 11, displayValue: "11.00" },
                { measureIndex: 1, value: 2, displayValue: "2.00" }
            ],
            index: 10,
            sum: 13,
            name: "American Robots"
        },
        {
            dataPoints: [
                { measureIndex: 0, value: 9, displayValue: "9.00" },
                { measureIndex: 1, value: 4, displayValue: "4.00" }
            ],
            index: 11,
            sum: 13,
            name: "Striking Kickers"
        }
    ],
    category: {
        displayName: "Team",
        count: 12,
        displayValues: [
            "Eccentric Fighters",
            "Blue Warriors",
            "American Lightning",
            "Alpha Monkeys",
            "Spinning Sharpshooters",
            "Infamous Assassins",
            "Xtreme Chuckers",
            "Boston Widows",
            "Butterfly Drivers",
            "Extreme Dynamos",
            "American Robots",
            "Striking Kickers"
        ],
        formatter: {},
        maxWidth: 106.73828125
    },
    viewport: { width: 619.0351668169521, height: 267.16501352569884 },
    settings: {
        color: "#5555FF",
        isClustered: false,
        gridEnabled: true,
        tooltipEnabled: true
    }
};

export const updateOptionsMock = {
    viewport: {
        width: 619.0351668169521,
        height: 267.16501352569884,
        scale: 0.86640625
    },
    dataViews: [
        {
            matrix: null,
            table: null,
            tree: null,
            single: null,
            metadata: {
                columns: [
                    {
                        roles: { values: true },
                        type: {
                            underlyingType: 260,
                            category: null,
                            primitiveType: 4,
                            extendedType: 260,
                            categoryString: null,
                            text: false,
                            numeric: true,
                            integer: true,
                            bool: false,
                            dateTime: false,
                            duration: false,
                            binary: false,
                            none: false
                        },
                        format: "0",
                        displayName: "Credit",
                        queryName: "Sum(Level By Team.Credit)",
                        expr: {
                            _kind: 4,
                            arg: {
                                _kind: 2,
                                source: {
                                    _kind: 0,
                                    entity: "Level By Team",
                                    variable: "l",
                                    kind: 0
                                },
                                ref: "Credit",
                                kind: 2
                            },
                            func: 0,
                            kind: 4
                        },
                        sort: 2,
                        sortOrder: 0,
                        index: 0,
                        isMeasure: true,
                        aggregates: { minLocal: 9, maxLocal: 43 }
                    },
                    {
                        roles: { values: true },
                        type: {
                            underlyingType: 260,
                            category: null,
                            primitiveType: 4,
                            extendedType: 260,
                            categoryString: null,
                            text: false,
                            numeric: true,
                            integer: true,
                            bool: false,
                            dateTime: false,
                            duration: false,
                            binary: false,
                            none: false
                        },
                        format: "0",
                        displayName: "Level",
                        queryName: "Sum(Level By Team.Level)",
                        expr: {
                            _kind: 4,
                            arg: {
                                _kind: 2,
                                source: {
                                    _kind: 0,
                                    entity: "Level By Team",
                                    variable: "l",
                                    kind: 0
                                },
                                ref: "Level",
                                kind: 2
                            },
                            func: 0,
                            kind: 4
                        },
                        index: 1,
                        isMeasure: true,
                        aggregates: { minLocal: 1, maxLocal: 5 }
                    },
                    {
                        roles: { category: true },
                        type: {
                            underlyingType: 1,
                            category: null,
                            primitiveType: 1,
                            extendedType: 1,
                            categoryString: null,
                            text: true,
                            numeric: false,
                            integer: false,
                            bool: false,
                            dateTime: false,
                            duration: false,
                            binary: false,
                            none: false
                        },
                        displayName: "Team",
                        queryName: "Level By Team.Team",
                        expr: {
                            _kind: 2,
                            source: {
                                _kind: 0,
                                entity: "Level By Team",
                                variable: "l",
                                kind: 0
                            },
                            ref: "Team",
                            kind: 2
                        },
                        index: 2,
                        identityExprs: [
                            {
                                _kind: 2,
                                source: {
                                    _kind: 0,
                                    entity: "Level By Team",
                                    kind: 0
                                },
                                ref: "Team",
                                kind: 2
                            }
                        ]
                    }
                ]
            },
            categorical: {
                categories: [
                    {
                        source: {
                            roles: { category: true },
                            type: {
                                underlyingType: 1,
                                category: null,
                                primitiveType: 1,
                                extendedType: 1,
                                categoryString: null,
                                text: true,
                                numeric: false,
                                integer: false,
                                bool: false,
                                dateTime: false,
                                duration: false,
                                binary: false,
                                none: false
                            },
                            displayName: "Team",
                            queryName: "Level By Team.Team",
                            expr: {
                                _kind: 2,
                                source: {
                                    _kind: 0,
                                    entity: "Level By Team",
                                    variable: "l",
                                    kind: 0
                                },
                                ref: "Team",
                                kind: 2
                            },
                            index: 2,
                            identityExprs: [
                                {
                                    _kind: 2,
                                    source: {
                                        _kind: 0,
                                        entity: "Level By Team",
                                        kind: 0
                                    },
                                    ref: "Team",
                                    kind: 2
                                }
                            ]
                        },
                        values: [
                            "Eccentric Fighters",
                            "Blue Warriors",
                            "American Lightning",
                            "Alpha Monkeys",
                            "Spinning Sharpshooters",
                            "Infamous Assassins",
                            "Xtreme Chuckers",
                            "Boston Widows",
                            "Butterfly Drivers",
                            "Extreme Dynamos",
                            "American Robots",
                            "Striking Kickers"
                        ],
                        identity: [
                            { identityIndex: 0 },
                            { identityIndex: 1 },
                            { identityIndex: 2 },
                            { identityIndex: 3 },
                            { identityIndex: 4 },
                            { identityIndex: 5 },
                            { identityIndex: 6 },
                            { identityIndex: 7 },
                            { identityIndex: 8 },
                            { identityIndex: 9 },
                            { identityIndex: 10 },
                            { identityIndex: 11 }
                        ],
                        identityFields: [
                            {
                                _kind: 2,
                                source: {
                                    _kind: 0,
                                    entity: "Level By Team",
                                    kind: 0
                                },
                                ref: "Team",
                                kind: 2
                            }
                        ]
                    }
                ],
                values: [
                    {
                        source: {
                            roles: { values: true },
                            type: {
                                underlyingType: 260,
                                category: null,
                                primitiveType: 4,
                                extendedType: 260,
                                categoryString: null,
                                text: false,
                                numeric: true,
                                integer: true,
                                bool: false,
                                dateTime: false,
                                duration: false,
                                binary: false,
                                none: false
                            },
                            format: "0",
                            displayName: "Credit",
                            queryName: "Sum(Level By Team.Credit)",
                            expr: {
                                _kind: 4,
                                arg: {
                                    _kind: 2,
                                    source: {
                                        _kind: 0,
                                        entity: "Level By Team",
                                        variable: "l",
                                        kind: 0
                                    },
                                    ref: "Credit",
                                    kind: 2
                                },
                                func: 0,
                                kind: 4
                            },
                            sort: 2,
                            sortOrder: 0,
                            index: 0,
                            isMeasure: true,
                            aggregates: { minLocal: 9, maxLocal: 43 }
                        },
                        values: [43, 41, 33, 32, 23, 22, 22, 12, 12, 12, 11, 9],
                        minLocal: 9,
                        maxLocal: 43
                    },
                    {
                        source: {
                            roles: { values: true },
                            type: {
                                underlyingType: 260,
                                category: null,
                                primitiveType: 4,
                                extendedType: 260,
                                categoryString: null,
                                text: false,
                                numeric: true,
                                integer: true,
                                bool: false,
                                dateTime: false,
                                duration: false,
                                binary: false,
                                none: false
                            },
                            format: "0",
                            displayName: "Level",
                            queryName: "Sum(Level By Team.Level)",
                            expr: {
                                _kind: 4,
                                arg: {
                                    _kind: 2,
                                    source: {
                                        _kind: 0,
                                        entity: "Level By Team",
                                        variable: "l",
                                        kind: 0
                                    },
                                    ref: "Level",
                                    kind: 2
                                },
                                func: 0,
                                kind: 4
                            },
                            index: 1,
                            isMeasure: true,
                            aggregates: { minLocal: 1, maxLocal: 5 }
                        },
                        values: [1, 1, 3, 2, 3, 3, 2, 5, 4, 1, 2, 4],
                        minLocal: 1,
                        maxLocal: 5
                    }
                ]
            }
        }
    ],
    viewMode: 1,
    editMode: 0,
    isInFocus: false,
    operationKind: 0,
    jsonFilters: [],
    type: 62,
    updateId: "5f96e1e4-f84f-d5b1-6d77-f371461f75cf"
};
