// A binary heap. Each element `e` satisfies `predicate(e, c)` for all children `c` below it in the heap. Predicates must be transitive.
function BinaryHeap(predicate) {
    var ary = [];

    // Remove the element at the top of the heap.
    this.get = function () {
        if(ary.length === 0) {
            return undefined;
        }

        var first = ary.shift();
        if(ary.length === 0) {
            return first.value;
        }

        // Put the last entry at the top of the heap.
        ary.unshift(ary.pop());

        // Percolate the last entry down to its rightful place to enforce the heap property.
        var curIdx = 0;
        while(true) {
            var leftChild = getLeftChildOf(curIdx);
            var rightChild = getRightChildOf(curIdx);

            // Decide which child node to swap with, if any.
            var whichToPromote;
            if(!isValid(leftChild) && !isValid(rightChild)) {
                break;
            } else if(!isValid(rightChild)) {
                whichToPromote = leftChild;
            } else {
                whichToPromote = doPredicate(leftChild, rightChild) ? leftChild : rightChild;
            }

            // Do a swap if appropriate.
            if(doPredicate(curIdx, whichToPromote)) {
                break;
            }
            swap(curIdx, whichToPromote);

            curIdx = whichToPromote;
        }

        return first.value;
    }

    // Add an element to the heap.
    this.put = function (priority, obj) {
        var curIdx = ary.push({key: priority, value: obj}) - 1;

        // Bubble the new entry upwards toward the root as far as possible to enforce the heap property.
        while(true) {
            if(curIdx === 0) {
                break;
            }

            var parent = getParentOf(curIdx);

            if(doPredicate(parent, curIdx)) {
                break;
            }

            swap(curIdx, parent);

            curIdx = parent;
        }
    }

    function getParentOf(i) {
        return Math.floor((i-1)/2);
    }

    function getLeftChildOf(i) {
        return (2*i) + 1;
    }

    function getRightChildOf(i) {
        return (2*i) + 2;
    }

    function swap(a, b) {
        var tmp = ary[a];
        ary[a] = ary[b];
        ary[b] = tmp;
    }

    function isValid(i) {
        return i < ary.length;
    }

    function doPredicate(a, b) {
        return predicate(ary[a].key, ary[b].key);
    }
}

exports.MaxHeap = function () { 
    return new BinaryHeap(function (a, b) { return a > b; });
}

exports.MinHeap = function () { 
    return new BinaryHeap(function (a, b) { return a < b; });
}