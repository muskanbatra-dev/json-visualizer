import React, { useCallback, useMemo, useEffect, useRef } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useReactFlow,
  ReactFlowProvider,
} from "reactflow";
import "reactflow/dist/style.css";
import { useSelector } from "react-redux";

const normalizePathToId = (p) =>
  "root-" +
  p
    .toString()
    .replace(/[\$\.\[\]\'\"]/g, "-")
    .replace(/-+/g, "-")
    .replace(/(^-|-$)/g, "");

const JsonTreeInner = ({ data }) => {
  const reactFlowInstanceRef = useRef(null);
  const { setCenter } = useReactFlow();
  const matchedNodeIds = useSelector((s) => s.json.matchedNodeIds || []);

  const generateFlowElements = useCallback(
    (obj, parentId = null, level = 0, parentPath = "$") => {
      const nodes = [];
      const edges = [];

      const entries = Array.isArray(obj)
        ? obj.map((v, i) => [i, v])
        : Object.entries(obj || {});

      entries.forEach(([key, value], index) => {
        // build path: if parent is array (key is index number), use [i], else .key
        const isArrayParent = Array.isArray(obj);
        const currentPath = isArrayParent
          ? `${parentPath}[${key}]`
          : `${parentPath}.${key}`;

        const normalizedId = normalizePathToId(currentPath);

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
          id: normalizedId,
          data: { label, rawKey: key, value, path: currentPath },
          position: { x: level * 250 + 150, y: index * 100 + level * 20 },
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
            id: `${parentId}__${normalizedId}`,
            source: parentId,
            target: normalizedId,
            animated: true,
          });
        }

        if (isObject || isArray) {
          const { nodes: childNodes, edges: childEdges } = generateFlowElements(
            value,
            normalizedId,
            level + 1,
            currentPath
          );
          nodes.push(...childNodes);
          edges.push(...childEdges);
        }
      });

      return { nodes, edges };
    },
    []
  );

  const { nodes, edges } = useMemo(() => {
    if (!data) return { nodes: [], edges: [] };
    const generated = generateFlowElements(data, null, 0, "$");

    const rootNode = {
      id: "root",
      data: { label: "root", path: "$" },
      position: { x: 0, y: 0 },
      style: {
        background: "#1E90FF",
        color: "white",
        border: "2px solid #333",
        borderRadius: "8px",
        padding: "6px 10px",
        fontWeight: "bold",
      },
    };

    const topEdges = generated.nodes.map((n) => ({
      id: `root__${n.id}`,
      source: "root",
      target: n.id,
      animated: true,
    }));

    return {
      nodes: [rootNode, ...generated.nodes],
      edges: [...topEdges, ...generated.edges],
    };
  }, [data, generateFlowElements]);

  // merge highlight style if node id is matched
  const nodesWithHighlight = useMemo(() => {
    if (!matchedNodeIds || matchedNodeIds.length === 0) return nodes;

    const set = new Set(matchedNodeIds);
    return nodes.map((n) => {
      if (set.has(n.id)) {
        return {
          ...n,
          style: {
            ...n.style,
            boxShadow: "0 0 0 4px rgba(255,255,0,0.25)",
            border: "3px solid #FFD700",
            transform: "scale(1.03)",
            zIndex: 9999,
          },
        };
      }
      return n;
    });
  }, [nodes, matchedNodeIds]);

  useEffect(() => {
    if (!matchedNodeIds || matchedNodeIds.length === 0) return;
    const firstId = matchedNodeIds[0];

    const node = nodes.find((n) => n.id === firstId);
    if (node && node.position) {
      try {
        setCenter(node.position.x, node.position.y, { duration: 300 });
      } catch (err) {}
    }
  }, [matchedNodeIds, nodes, setCenter]);

  return (
    <div style={{ height: "80vh", width: "100%" }}>
      <ReactFlow nodes={nodesWithHighlight} edges={edges} fitView>
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

const JsonTree = ({ data }) => {
  return (
    <ReactFlowProvider>
      <JsonTreeInner data={data} />
    </ReactFlowProvider>
  );
};

export default JsonTree;
