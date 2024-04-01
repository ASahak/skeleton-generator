function findArrayDifference(currentArray: any[], previousArray: any[]) {
	const currentSet = new Set(currentArray);
	const previousSet = new Set(previousArray);

	const added = [];
	const removed = [];

	for (const element of currentArray) {
		if (!previousSet.has(element)) {
			added.push(element);
		}
	}

	for (const element of previousArray) {
		if (!currentSet.has(element)) {
			removed.push(element);
		}
	}

	return {
		added,
		removed,
		emitted: currentArray,
	};
}

export const useDiffArray = (arr: any[], prevArr: any[]) => {
	return findArrayDifference(arr, prevArr);
};
