import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import * as d3 from 'd3';
import { Lie } from '../types';

export const WebOfLiesGraph = ({ lies }: { lies: Lie[] }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || lies.length === 0) return;

    const width = svgRef.current.clientWidth;
    const height = 400;

    // Clear previous graph
    d3.select(svgRef.current).selectAll('*').remove();

    // Prepare data
    const nodes: any[] = [];
    const links: any[] = [];
    const nodeMap = new Map();

    // Add lie nodes
    lies.forEach(lie => {
      const lieNode = { id: lie.id, type: 'lie', name: lie.name, status: lie.status, severity: lie.severity };
      nodes.push(lieNode);
      nodeMap.set(lie.id, lieNode);

      // Add "Who" nodes
      if (lie.who) {
        const whoId = `who-${lie.who}`;
        if (!nodeMap.has(whoId)) {
          const whoNode = { id: whoId, type: 'who', name: lie.who };
          nodes.push(whoNode);
          nodeMap.set(whoId, whoNode);
        }
        links.push({ source: lie.id, target: whoId });
      }

      // Add "Where" nodes
      if (lie.where) {
        const whereId = `where-${lie.where}`;
        if (!nodeMap.has(whereId)) {
          const whereNode = { id: whereId, type: 'where', name: lie.where };
          nodes.push(whereNode);
          nodeMap.set(whereId, whereNode);
        }
        links.push({ source: lie.id, target: whereId });
      }
    });

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id((d: any) => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collide', d3.forceCollide().radius(30));

    const link = svg.append('g')
      .attr('stroke', '#ffffff')
      .attr('stroke-opacity', 0.4)
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke-width', 2);

    const node = svg.append('g')
      .attr('stroke', '#fff')
      .attr('stroke-width', 1.5)
      .selectAll('circle')
      .data(nodes)
      .join('circle')
      .attr('r', d => d.type === 'lie' ? 12 : 8)
      .attr('fill', d => {
        if (d.type === 'who') return '#3b82f6'; // blue
        if (d.type === 'where') return '#10b981'; // green
        // Lie color based on status
        if (d.status === 'busted') return '#ef4444'; // red
        if (d.status === 'safe') return '#22c55e'; // green
        return '#eab308'; // yellow (active)
      })
      .call(d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended) as any);

    const label = svg.append('g')
      .selectAll('text')
      .data(nodes)
      .join('text')
      .attr('dy', 20)
      .attr('text-anchor', 'middle')
      .attr('font-size', '10px')
      .attr('fill', '#ffffff')
      .attr('font-weight', 'bold')
      .text(d => d.name.length > 15 ? d.name.substring(0, 15) + '...' : d.name);

    node.append('title')
      .text(d => d.name);

    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      node
        .attr('cx', (d: any) => d.x)
        .attr('cy', (d: any) => d.y);

      label
        .attr('x', (d: any) => d.x)
        .attr('y', (d: any) => d.y);
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
  }, [lies]);

  return (
    <motion.div 
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="mb-12 bg-white/10 backdrop-blur-3xl border border-white/20 rounded-[2rem] p-8 overflow-hidden"
    >
      <h2 className="text-2xl font-bold text-white mb-2">The Web of Lies</h2>
      <p className="text-orange-100 text-sm mb-6">See how your fictions connect. Drag nodes to untangle the web.</p>
      
      <div className="w-full h-[400px] bg-black/20 rounded-2xl border border-white/10 overflow-hidden relative">
        <svg ref={svgRef} className="w-full h-full" />
        <div className="absolute bottom-4 right-4 flex gap-4 bg-black/40 backdrop-blur-md px-4 py-2 rounded-xl text-xs font-medium text-white">
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-[#eab308]"></div> Active Lie</div>
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-[#ef4444]"></div> Busted Lie</div>
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-[#3b82f6]"></div> Person</div>
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-[#10b981]"></div> Place</div>
        </div>
      </div>
    </motion.div>
  );
};
