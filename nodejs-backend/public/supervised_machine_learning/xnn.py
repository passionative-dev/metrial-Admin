import numpy as np
import heapq
from kd_tree import Kdtree, Node
from read_files import getDimensions
from statistics import mode

def euclideanDistance(a, b):
    return np.linalg.norm(np.asarray(a)-np.asarray(b))

def k_nearestAux(dimensions, k, point, current_node, priority_queue=[], depth=0):

    axis = depth % (dimensions-1)
    depth += 1

    if current_node.left == None and current_node.right == None:
        distance = euclideanDistance(point[:dimensions-1], current_node.value[:dimensions-1])
        if len(priority_queue) < k:
            heapq.heappush(priority_queue, (-distance,current_node.value))
            priority_queue = sorted(priority_queue)

        elif -distance < -priority_queue[0][0]:
            heapq.heappushpop(priority_queue, (-distance, current_node.value))
            priority_queue = sorted(priority_queue)

        return priority_queue

    else:

        if point[axis] > current_node.value:
            nearBranch = current_node.right
            opositeBranch = current_node.left
        else:
            nearBranch = current_node.left
            opositeBranch = current_node.right

        priority_queue = k_nearestAux(dimensions, k, point, nearBranch, priority_queue, depth)

        if len(priority_queue) < k or priority_queue[0][1][axis] <= abs(point[axis] - current_node.value):

            priority_queue = k_nearestAux(dimensions, k, point, opositeBranch, priority_queue, depth)

        return priority_queue

class Xnn():

    def __init__(self, priority_queue):
        self.priority_queue = priority_queue
        self.kdtree = None

    def buildKdtree(self, point_list):
        self.kdtree = Kdtree.buildKdtree(point_list)

    def k_nearest(self, dimensions, k, point, current_node):
        self.priority_queue = k_nearestAux(dimensions, k, point, current_node, self.priority_queue, depth=0)

    def getClassificationFromPQ(self, dimensions):
        temp = []
        for p in self.priority_queue:
            temp.append(p[1][dimensions-1])

        return mode(temp)

    def getStatisticsFromTestPoints(self, k, test_point_list, classifications):
        
        tp = fp = tn = fn = 0
        dimensions = getDimensions(test_point_list)
        i = 0
        for point in test_point_list:
            self.k_nearest(dimensions, k, point, self.kdtree)
            classification = self.getClassificationFromPQ(dimensions)
            if point[dimensions-1] == classifications[0]:
                if classification == point[dimensions-1]:
                    tp += 1
                else:
                    fn += 1
            else:
                if classification == point[dimensions-1]:
                    tn += 1
                else:
                    fp += 1
        try:            
            precision = tp/(tp + fp) * 100
            revocation = tp/(tp+fn) * 100
            accuracy = (tp+tn)/(tp+tn+fp+fn) * 100
        except ZeroDivisionError:
            precision = revocation = 0
            accuracy = (tp+tn)/(tp+tn+fp+fn) * 100

        print("Precisão: ", round(precision, 2), "%")
        print("Revocação: ", round(revocation, 2), "%")
        print("Acurácia: ", round(accuracy, 2), "%")