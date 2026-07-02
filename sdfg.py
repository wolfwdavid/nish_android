from typing import List


class Solution:
    def getCommon(self, nums1: List[int], nums2: List[int]) -> int:

        listN = []

        for n in self.nums1:
            listN.append(n)
        for n in self.nums2:
            listN.append(n)

        listdual = []

        for i in range(listN):
            if listN[i].count >1 :
                listdual.append(listN[i])

        ans = []
        
        if listdual.count() > 1:
                ans.append(max(i))

        return ans 
    

nums1 = [1,2,3]
nums2 = [2,4]

print(Solution.getCommon(nums1 , nums2))
                


        
