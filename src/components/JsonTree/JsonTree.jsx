import React, { useCallback, useMemo } from "react";
import ReactFlow, { MiniMap, Controls, Background } from "reactflow";
import "reactflow/dist/style.css";

const JsonTree = ({ data }) => {
  const generateFlowElements = useCallback(
    (obj, parentId = null, level = 0) => {
      const nodes = [];
      const edges = [];

      Object.entries(obj || {}).forEach(([key, value], index) => {
        const nodeId = `${parentId ? parentId + "-" : ""}${key}-${index}`;
        nodes.push({
          id: nodeId,
          data: { label: `${key}: ${typeof value === "object" ? "" : value}` },
          position: { x: level * 200, y: index * 100 },
          style: {
            background: "#FFB347",
            color: "black",
            border: "2px solid #333",
            borderRadius: "8px",
            padding: "5px 10px",
          },
        });

        if (parentId) {
          edges.push({
            id: `${parentId}-${nodeId}`,
            source: parentId,
            target: nodeId,
          });
        }

        if (typeof value === "object" && value !== null) {
          const { nodes: childNodes, edges: childEdges } = generateFlowElements(
            value,
            nodeId,
            level + 1
          );
          nodes.push(...childNodes);
          edges.push(...childEdges);
        }
      });

      return { nodes, edges };
    },
    []
  );

  const { nodes, edges } = useMemo(
    () => generateFlowElements(data, "root"),
    [data]
  );

  nodes.unshift({
    id: "root",
    data: { label: "root" },
    position: { x: 0, y: 0 },
    style: {
      background: "#FF851B",
      color: "white",
      border: "2px solid #333",
      borderRadius: "8px",
      padding: "5px 10px",
    },
  });

  return (
    <div style={{ height: "80vh", width: "100%" }}>
      <ReactFlow nodes={nodes} edges={edges} fitView>
        <MiniMap />
        <Controls />
        <Background gap={16} color="#aaa" />
      </ReactFlow>
    </div>
  );
};

export default JsonTree;
