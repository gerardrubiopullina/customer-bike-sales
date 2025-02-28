
export const getClusterColorClass = (cluster: number) => {
    switch(cluster) {
      case 1: return "cluster-1-bg";
      case 2: return "cluster-2-bg";
      case 3: return "cluster-3-bg";
      default: return "bg-gray-400";
    }
};