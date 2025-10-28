import React, { useCallback, useMemo } from "react";
import ReactFlow, { MiniMap, Controls, Background } from "reactflow";
import "reactflow/dist/style.css";

const JsonTree = ({ data }) => {
  const generateFlowElements = useCallback(
    (obj, parentId = null, level = 0) => {
      const nodes = [];
      const edges = [];

      const entries = Array.isArray(obj)
        ? obj.map((v, i) => [i, v])
        : Object.entries(obj || {});

      entries.forEach(([key, value], index) => {
        const nodeId = `${parentId ? parentId + "-" : ""}${key}-${index}`;

        const isObject =
          typeof value === "object" && value !== null && !Array.isArray(value);
        const isArray = Array.isArray(value);
        const isPrimitive = !isObject && !isArray;

        const backgroundColor = isObject
          ? "#7B68EE"
          : isArray
          ? "#2ECC71"
          : "#FFA500";

        const label = isPrimitive ? `${key}: ${String(value)}` : `${key}`;

        nodes.push({
          id: nodeId,
          data: { label },
          position: { x: level * 250, y: index * 100 },
          style: {
            background: backgroundColor,
            color: "white",
            border: "2px solid #333",
            borderRadius: "8px",
            padding: "6px 10px",
            fontSize: "14px",
          },
        });

        if (parentId) {
          edges.push({
            id: `${parentId}-${nodeId}`,
            source: parentId,
            target: nodeId,
            animated: true,
          });
        }

        if (isObject || isArray) {
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
      background: "#1E90FF",
      color: "white",
      border: "2px solid #333",
      borderRadius: "8px",
      padding: "6px 10px",
      fontWeight: "bold",
    },
  });

  return (
    <div style={{ height: "80vh", width: "100%" }}>
      <ReactFlow nodes={nodes} edges={edges} fitView>
        <MiniMap
          nodeColor={(n) => {
            if (n.style?.background === "#7B68EE") return "#7B68EE";
            if (n.style?.background === "#2ECC71") return "#2ECC71";
            if (n.style?.background === "#FFA500") return "#FFA500";
            return "#1E90FF";
          }}
        />
        <Controls />
        <Background gap={16} color="#aaa" />
      </ReactFlow>
    </div>
  );
};

export default JsonTree;
