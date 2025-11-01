import { createElement } from "@fullcalendar/core/preact";
import { createFormatter, getDateMeta, StandardEvent} from "@fullcalendar/core/internal";

const DEFAULT_TIME_FORMATTER = createFormatter({
    hour: "numeric",
    minute: "2-digit",
    omitZeroMinute: true,
    meridiem: "narrow",
});

export default function Event(props) {
    const { event } = props;
    const childProps = createProps(event);
    const minutesDiff = (event.range.end - event.range.start) / 60000;
    const height = minutesDiff / 30 * 25; // 1 slot = 30 min, 1 slot = 25px

    return createElement(
        "div",
        {
            class: "fc-timegrid-event-harness fc-timegrid-event-harness-inset fc-h-event",
            style: {
                height: height + 'px',
            },
        },
        createElement(
            StandardEvent,
            Object.assign(childProps, {
                defaultTimeFormat: DEFAULT_TIME_FORMATTER,
                isDragging: false,
                isResizing: false,
                isDateSelecting: false,
                isSelected: false,
            }))
    );
}

function createProps(event) {
    const today = getFullDayRange();
    const meta = getDateMeta(event.instance.range.start, today);
    return Object.assign(meta, {
        seg: {
            isStart: event.instance.range.start >= today.start,
            isEnd: event.instance.range.end <= today.end,
            eventRange: event,
        },
    });
}

function getFullDayRange(date, offset) {
    const start = new Date(date || Date.now());
    offset && start.setUTCDate(start.getUTCDate() + offset);
    start.setUTCHours(0, 0, 0, 0);

    const end = new Date(start);
    end.setUTCDate(end.getUTCDate() + 1);

    return { start, end };
}
