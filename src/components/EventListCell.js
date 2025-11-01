import { createElement } from "@fullcalendar/core/preact";
import Event from "./Event";

export default function EventListCell(props) {
    const { children, context, events } = props;

    return createElement(
        "td",
        {
            class: 'fc-events fc-timegrid-slot fc-timegrid-slot-lane'
        },
        events.map((event) => createElement(Event, { context, event })),
        children
    );
}