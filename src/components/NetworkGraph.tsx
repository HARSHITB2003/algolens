import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { TOPIC_COLORS } from '../constants';
import type { ContentItem, Topic } from '../constants';

interface Node extends d3.SimulationNodeDatum {
  id: number;
  topic: Topic;
  title: string;
  isLiked: boolean;
  isSkipped: boolean;
  isShown: boolean;
}

interface Link extends d3.SimulationLinkDatum<Node> {}

interface NetworkGraphProps {
  contentDB: ContentItem[];
  viewedIds: Set<number>;
  likedIds: Set<number>;
  skippedIds: Set<number>;
  onClose?: () => void;
}

const NetworkGraph: React.FC<NetworkGraphProps> = ({ 
  contentDB, 
  viewedIds, 
  likedIds, 
  skippedIds,
  onClose 
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    const svg = d3.select(svgRef.current)
      .attr('viewBox', [0, 0, width, height]);
    
    svg.selectAll('*').remove();

    const nodes: Node[] = contentDB.map(c => ({
      id: c.id,
      topic: c.topic,
      title: c.title,
      isLiked: likedIds.has(c.id),
      isSkipped: skippedIds.has(c.id),
      isShown: viewedIds.has(c.id)
    }));

    const links: Link[] = [];
    // Connect nodes of same topic
    nodes.forEach((node, i) => {
      nodes.slice(i + 1).forEach(other => {
        if (node.topic === other.topic) {
          links.push({ source: node.id, target: other.id });
        }
      });
    });

    // User node
    const userNode: Node = { 
      id: 0, 
      topic: 'tech' as Topic, 
      title: 'USER', 
      isLiked: false, 
      isSkipped: false, 
      isShown: true,
      x: width / 2,
      y: height / 2,
      fx: width / 2,
      fy: height / 2
    };
    
    const allNodes = [userNode, ...nodes];

    const simulation = d3.forceSimulation(allNodes)
      .force('link', d3.forceLink(links).id((d: any) => d.id).distance(100).strength(0.1))
      .force('charge', d3.forceManyBody().strength(-150))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(30));

    // Attraction force for liked items to user
    simulation.force('attraction', (alpha) => {
      nodes.forEach(node => {
        if (likedIds.has(node.id)) {
          node.vx! += (userNode.x! - node.x!) * 0.1 * alpha;
          node.vy! += (userNode.y! - node.y!) * 0.1 * alpha;
        } else if (skippedIds.has(node.id)) {
          // Repulsion for skipped
          node.vx! -= (userNode.x! - node.x!) * 0.05 * alpha;
          node.vy! -= (userNode.y! - node.y!) * 0.05 * alpha;
        }
      });
    });

    const link = svg.append('g')
      .attr('stroke', '#1A2030')
      .attr('stroke-opacity', 0.2)
      .selectAll('line')
      .data(links)
      .join('line');

    const node = svg.append('g')
      .selectAll('g')
      .data(allNodes)
      .join('g')
      .call(d3.drag<any, any>()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended));

    node.append('circle')
      .attr('r', d => d.id === 0 ? 12 : 8)
      .attr('fill', d => d.id === 0 ? '#FFFFFF' : TOPIC_COLORS[d.topic])
      .attr('stroke', d => d.isLiked ? '#FFFFFF' : 'none')
      .attr('stroke-width', 2)
      .attr('opacity', d => {
        if (d.id === 0) return 1;
        if (d.isSkipped) return 0.2;
        if (d.isShown) return 1;
        return 0.4;
      })
      .attr('filter', d => d.isLiked ? 'drop-shadow(0 0 8px rgba(255,255,255,0.8))' : 'none');

    node.append('text')
      .text(d => d.id === 0 ? 'YOU' : '')
      .attr('fill', '#FFFFFF')
      .attr('font-size', '10px')
      .attr('font-family', 'JetBrains Mono')
      .attr('text-anchor', 'middle')
      .attr('dy', 25);

    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      node.attr('transform', (d: any) => `translate(${d.x},${d.y})`);
    });

    function dragstarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: any) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: any) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return () => {
      simulation.stop();
    };
  }, [contentDB, viewedIds, likedIds, skippedIds]);

  return (
    <div className="fixed inset-0 z-50 bg-engine-black/95 flex flex-col">
      <div className="p-6 flex justify-between items-center bg-engine-black border-b border-engine-border">
        <div>
          <h2 className="text-white font-display text-2xl font-bold">Filter Bubble Network</h2>
          <p className="text-engine-dim text-sm font-mono mt-1">Force-directed visualization of user-content dynamics</p>
        </div>
        <button 
          onClick={onClose}
          className="px-6 py-2 bg-engine-panel border border-engine-border text-white font-mono text-sm hover:bg-engine-border transition-colors rounded-lg"
        >
          Close View
        </button>
      </div>
      <div className="flex-1 relative overflow-hidden">
        <svg ref={svgRef} className="w-full h-full" />
        <div className="absolute bottom-8 left-8 p-4 bg-engine-panel border border-engine-border rounded-lg max-w-xs font-mono text-[10px] text-engine-dim">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_8px_white]" />
            <span>Center Node: Your Identity</span>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-algo-cyan" />
            <span>Content Nodes (Colored by Topic)</span>
          </div>
          <p className="mt-4 leading-relaxed">
            Nodes you LIKE attract toward the center. Nodes you SKIP repel toward edges. Same-topic nodes attract each other. Watch the bubble form.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NetworkGraph;
