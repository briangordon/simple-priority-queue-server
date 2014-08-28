// A binary heap. Each element `e` satisfies `predicate(e, c)` for all children `c` below it in the heap. Predicates must be transitive.
function BinaryHeap(predicate) {
    var ary = [];

    // Remove the element at the top of the heap.
    this.get = function () {
        if(ary[0] === undefined) {
            return undefined;
        }

        var ret = ary[0].value;
        ary[0] = undefined;

        var curIdx = 0;
        while(true) {
            var leftChild = getLeftChildOf(curIdx);
            var rightChild = getRightChildOf(curIdx);

            // Decide which child node to promote.
            var whichToPromote;
            if(!isValid(leftChild) && !isValid(rightChild)) {
                break;
            } else if(!isValid(leftChild)) {
                whichToPromote = rightChild;
            } else if(!isValid(rightChild)) {
                whichToPromote = leftChild;
            } else {
                whichToPromote = doPredicate(leftChild, rightChild) ? leftChild : rightChild;
            }

            // Promote the chosen child.
            swap(curIdx, whichToPromote);

            curIdx = whichToPromote;
        }

        return ret;
    }

    // Add an element to the heap.
    this.put = function (priority, obj) {
        // Scan through the array looking for the first undefined entry and fill it.
        var curIdx;
        for(var i=0; i<=ary.length; i++) {
            if(ary[i] === undefined) {
                curIdx = i;
                ary[i] = {key: priority, value: obj};
                break;
            }
        }

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
        if(i === 0) {
            return undefined;
        } else {
            return Math.floor((i-1)/2);
        }
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
        return (i < ary.length) && ary[i];
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