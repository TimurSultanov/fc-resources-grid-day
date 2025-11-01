import { memoize, sliceEventStore } from '@fullcalendar/core/internal';
import { buildSlatMetas, DayTimeColsView } from '@fullcalendar/timegrid/internal';
import { createElement } from '@fullcalendar/core/preact';
import EventListCell from './components/EventListCell';
import TimeColsAxisCell from './components/TimeColsAxisCell';

export class ResourcesGridDayView extends DayTimeColsView {
    constructor() {
        super(...arguments);
        this.buildSlatMetas = memoize(buildSlatMetas);
        this.viewsOptions = this.context.viewApi.getOption('views');
    }

    render() {
        let { options, dateEnv } = this.context;
        const resourceList = this.viewsOptions?.resourcesGridDay?.resourceList ?? [];
        let {props} = this;
        let { dateProfile } = props;
        let slatMetas = this.buildSlatMetas(dateProfile.slotMinTime, dateProfile.slotMaxTime, options.slotLabelInterval, options.slotDuration, dateEnv);

        const headerContent = createElement(
            'tr',
            { role: 'row' },
            this.createHeaderColumns(resourceList),
        );

        return this.renderSimpleLayout(
            headerContent,
            false,
            () => this.createBodyContent(resourceList, props, this.context, slatMetas),
        );
    }

    createHeaderColumns(resourceList) {
        const columns = [
            createElement(
                'th',
                {
                    'aria-hidden': 'true',
                    class: 'fc-timegrid-axis',
                },
                createElement('div', {class: 'fc-timegrid-axis-frame'})),
        ];

        resourceList.forEach(resource => {
            columns.push(
                createElement(
                    'th',
                    {
                        class: 'fc-col-header-cell',
                    },
                    createElement('div', {}, resource.name)
                )
            )
        });

        return columns;
    }

    createBodyContent(resourceList, props, context, slatMetas) {
        const resourceIdProp = this.viewsOptions.resourcesGridDay.resourceIdProp;
        const todayRange = props.dateProfile.renderRange;
        const events = sliceEventStore(
            props.eventStore,
            props.eventUiBases,
            todayRange,
            props.nextDayThreshold
        );

        const rows = [];
        slatMetas.forEach((slatMeta, key) => {
            rows.push(
                createElement(
                    "tr",
                    { class: "fc-multicol-row" },
                    createElement(TimeColsAxisCell, slatMeta),
                    resourceList.map((resource) =>
                        createElement(
                            EventListCell,
                            {
                                context,
                                date: slatMeta.date,
                                events: events.fg.filter(event => {
                                    let currentTimeStart = slatMeta.date;
                                    let nextTimeSlotStart = currentTimeStart;
                                    if (slatMetas[key + 1]) {
                                        nextTimeSlotStart = slatMetas[key + 1].date;
                                    }

                                    let eventTime = event.range.start;

                                    currentTimeStart.setYear(eventTime.getFullYear());
                                    currentTimeStart.setMonth(eventTime.getMonth());
                                    currentTimeStart.setDate(eventTime.getDate());
                                    nextTimeSlotStart.setYear(eventTime.getFullYear());
                                    nextTimeSlotStart.setMonth(eventTime.getMonth());
                                    nextTimeSlotStart.setDate(eventTime.getDate());

                                    return eventTime >= currentTimeStart
                                        && eventTime < nextTimeSlotStart
                                        && event.def.extendedProps[resourceIdProp] === resource.id;
                                }),
                            },
                        )
                    )
                )
            );
        })

        return [
            createElement(
                "table",
                { class: "fc-scrollgrid fc-multicol" },
                createElement("colgroup", {style: {width: '50px'}}),
                createElement("tbody", {}, rows)
            ),
        ];
    }
}
