import {List, Map} from 'immutable';

function getWinners(vote) {
	if (!vote) return [];
	const [a, b] = vote.get('pair');
	const aVotes = vote.getIn(['tally', a], 0);
	const bVotes = vote.getIn(['tally', b], 0);
	if      (aVotes > bVotes)  return [a];
	else if (aVotes < bVotes)  return [b];
	else                       return [a, b];
}

export function setEntries (currentState, entries) {
	return currentState.set('entries', List(entries));
}

export function next (currentState) {
	const entries = currentState.get('entries')
						.concat(getWinners(currentState.get('vote')));

	if (entries.size === 1) {
		return currentState.remove('vote')
							.remove('entries')
							.set('winner', entries.first());
	}
	
	return currentState.merge({
    	vote: Map({pair: entries.take(2)}),
   		entries: entries.skip(2)
  	});
}

export function vote (currentState, entry) {
	return currentState.updateIn(
		['vote', 'tally', entry],
		0,
		tally => tally + 1
	);
}