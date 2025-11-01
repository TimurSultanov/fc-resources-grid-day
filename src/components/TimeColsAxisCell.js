import { ContentContainer, createFormatter, ViewContextType } from "@fullcalendar/core/internal";
import { createElement } from "@fullcalendar/core/preact";

const DEFAULT_LABEL_FORMAT = createFormatter({
    hour: 'numeric',
    minute: '2-digit',
    omitZeroMinute: true,
    meridiem: 'short',
});

export default function TimeColsAxisCell(props) {
    let classNames = [
        'fc-timegrid-slot',
        'fc-timegrid-slot-label',
        props.isLabeled ? 'fc-scrollgrid-shrink' : 'fc-timegrid-slot-minor',
    ];

    return (createElement(ViewContextType.Consumer, null, (context) => {
        if (!props.isLabeled) {
            return (createElement("td", { className: classNames.join(' '), "data-time": props.isoTimeStr }));
        }
        let { dateEnv, options, viewApi } = context;
        let labelFormat = DEFAULT_LABEL_FORMAT;
        if (options.slotLabelFormat != null) {
            const format = Array.isArray(options.slotLabelFormat)
                ? options.slotLabelFormat[0]
                : options.slotLabelFormat;
            labelFormat = createFormatter(format);
        }
        let renderProps = {
            level: 0,
            time: props.time,
            date: dateEnv.toDate(props.date),
            view: viewApi,
            text: dateEnv.format(props.date, labelFormat),
        };

        return createElement(
            ContentContainer,
            {
                elTag: "td",
                elClasses: classNames,
                elAttrs: {
                    'data-time': props.isoTimeStr,
                },
                renderProps: renderProps,
                generatorName: "slotLabelContent",
                customGenerator: options.slotLabelContent,
                defaultGenerator: renderInnerContent,
                classNameGenerator: options.slotLabelClassNames,
                didMount: options.slotLabelDidMount,
                willUnmount: options.slotLabelWillUnmount
            },
            (InnerContent) => createElement(
                "div",
                { className: "fc-timegrid-slot-label-frame fc-scrollgrid-shrink-frame" },
                createElement(
                    InnerContent,
                    {
                        elTag: "div",
                        elClasses: [
                            'fc-timegrid-slot-label-cushion',
                            'fc-scrollgrid-shrink-cushion',
                        ]
                    })));
    }));
}

function renderInnerContent(props) {
    return props.text;
}
