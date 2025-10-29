import React, {
  useCallback,
  useMemo,
  useEffect,
  useRef,
  useState,
} from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useReactFlow,
  ReactFlowProvider,
} from "reactflow";
import "reactflow/dist/style.css";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

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
  const [hoveredNode, setHoveredNode] = useState(null);

  const generateFlowElements = useCallback(
    (obj, parentId = null, level = 0, parentPath = "$") => {
      const nodes = [];
      const edges = [];

      const entries = Array.isArray(obj)
        ? obj.map((v, i) => [i, v])
        : Object.entries(obj || {});

      entries.forEach(([key, value], index) => {
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
            cursor: "pointer",
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
        cursor: "pointer",
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

 
  const handleNodeClick = (_, node) => {
    if (!node?.data?.path) return;
    navigator.clipboard.writeText(node.data.path);
    toast.success(`Copied path: ${node.data.path}`);
  };

  return (
    <div style={{ height: "80vh", width: "100%", position: "relative" }}>
      <ReactFlow
        nodes={nodesWithHighlight}
        edges={edges}
        fitView
        onNodeClick={handleNodeClick}
        onNodeMouseEnter={(_, node) => setHoveredNode(node.data)}
        onNodeMouseLeave={() => setHoveredNode(null)}
      >
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

   
      {hoveredNode && (
        <div
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            background: "rgba(0,0,0,0.8)",
            color: "white",
            padding: "8px 12px",
            borderRadius: "6px",
            fontSize: "13px",
            pointerEvents: "none",
            zIndex: 1000,
          }}
        >
          <strong>Path:</strong> {hoveredNode.path}
          <br />
          <strong>Value:</strong>{" "}
          {typeof hoveredNode.value === "object"
            ? JSON.stringify(hoveredNode.value)
            : hoveredNode.value?.toString()}
        </div>
      )}
    </div>
  );
};

const JsonTree = ({ data }) => (
  <ReactFlowProvider>
    <JsonTreeInner data={data} />
  </ReactFlowProvider>
);

export default JsonTree;
