import { createPlugin } from '@fullcalendar/core';
import { ResourcesGridDayView } from './ResourcesGridDayView';

export default createPlugin({
    name: 'ResourcesGridDayView',
    initialView: 'resourcesGridDay',
    views: {
        resourcesGridDay: {
            component: ResourcesGridDayView,
            usesMinMaxTime: true,
            slotDuration: '00:30:00',
            slotEventOverlap: true,
            resourceIdProp: 'id',
            buttonText: 'Resources'
        }
    }
});
