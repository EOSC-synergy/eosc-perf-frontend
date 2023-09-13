import { type Result } from '@eosc-perf/eosc-perf-client';

type ResultCallbacks = {
    select: (result: Result) => void;
    selectMultiple: (result: Result[]) => void;
    unselect: (result: Result) => void;
    unselectMultiple: (result: Result[]) => void;
    isSelected: (result: Result) => boolean;

    reload: () => void;

    // show pop up with result info & json
    display: (result: Result) => void;
    report: (result: Result) => void;
    edit: (result: Result) => void;
};

export default ResultCallbacks;
