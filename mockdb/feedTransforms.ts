import { Event } from '@/types/event';
import { MomentData } from '@/types/feed';
import { events } from './mockEvents';
import { users } from './mockUsers';
import { rsvps } from './mockRsvps';

export const getFeedData = (): MomentData[] => {
  console.log('Generating feed data...');
  
  const upcomingEvents = events.filter(event => event.status === 'upcoming');
  console.log(`Found ${upcomingEvents.length} upcoming events`);
  
  return upcomingEvents.map(event => {
    const host = users.find(u => u.id === event.hostId)!;
    const goingCount = rsvps.filter(r => r.eventId === event.id && r.status === 'going').length;
    const maybeCount = rsvps.filter(r => r.eventId === event.id && r.status === 'maybe').length;
    const notGoingCount = rsvps.filter(r => r.eventId === event.id && r.status === 'not_going').length;

    const momentData: MomentData = {
      id: event.id,
      title: event.title,
      description: event.description,
      date: new Date(event.date),
      isHost: true, // We'll update this when we have current user context
      host: {
        id: host.id,
        username: `@${host.username}`,
        name: host.name,
        verified: host.isBusinessAccount,
      },
      metadata: {
        createdAt: event.createdAt,
        going: goingCount,
        interested: maybeCount,
        notGoing: notGoingCount,
        views: Math.floor(Math.random() * 1000),
      }
    };

    console.log('Generated moment data:', momentData);
    return momentData;
  });
}; 