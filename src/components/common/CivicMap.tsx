import React, { useEffect, useRef, useState } from 'react';
import { CivicIssue } from '../../types/index.js';
import { MapPin, Layers, Filter, RefreshCw } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface CivicMapProps {
  issues: CivicIssue[];
  onSelectIssue?: (issue: CivicIssue) => void;
  height?: string;
  selectedCategory?: string;
  selectedStatus?: string;
}

export const CivicMap: React.FC<CivicMapProps> = ({
  issues,
  onSelectIssue,
  height = '460px',
  selectedCategory: initialCategory = 'all',
  selectedStatus: initialStatus = 'all'
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  const [categoryFilter, setCategoryFilter] = useState<string>(initialCategory);
  const [statusFilter, setStatusFilter] = useState<string>(initialStatus);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const defaultCenter: [number, number] = [28.6145, 77.2090];
    const map = L.map(mapContainerRef.current, {
      center: defaultCenter,
      zoom: 14,
      zoomControl: true
    });

    // Clean CartoDB Voyager Map Tiles (Professional Light GovTech Look)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
      maxZoom: 19
    }).addTo(map);

    const markersGroup = L.layerGroup().addTo(map);
    markersLayerRef.current = markersGroup;
    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Markers based on filters
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();

    const filtered = issues.filter(issue => {
      if (categoryFilter !== 'all' && issue.categoryId !== categoryFilter) return false;
      if (statusFilter !== 'all') {
        if (statusFilter === 'open' && (issue.status === 'resolved' || issue.status === 'closed')) return false;
        if (statusFilter === 'in_progress' && issue.status !== 'in_progress') return false;
        if (statusFilter === 'resolved' && issue.status !== 'resolved' && issue.status !== 'citizen_verified') return false;
      }
      return true;
    });

    filtered.forEach(issue => {
      const getMarkerColor = () => {
        if (issue.status === 'resolved' || issue.status === 'citizen_verified') return '#059669'; // Green
        if (issue.status === 'in_progress') return '#d97706'; // Amber
        if (issue.priorityLevel === 'CRITICAL') return '#dc2626'; // Red
        return '#0f766e'; // Teal
      };

      const markerColor = getMarkerColor();
      const customIcon = L.divIcon({
        className: 'custom-civic-marker',
        html: `
          <div style="
            background-color: ${markerColor};
            width: 28px;
            height: 28px;
            border-radius: 50%;
            border: 2px solid #ffffff;
            box-shadow: 0 2px 5px rgba(0,0,0,0.25);
            display: flex;
            align-items: center;
            justify-content: center;
            color: #ffffff;
            font-size: 10px;
            font-weight: 700;
            font-family: monospace;
          ">
            ${issue.id.split('-')[1] || 'CIV'}
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });

      const marker = L.marker([issue.location.lat, issue.location.lng], { icon: customIcon });

      const popupHtml = `
        <div style="padding: 4px; font-family: Inter, sans-serif; min-width: 200px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
            <span style="font-family: monospace; font-size: 11px; font-weight: 700; color: #0f766e;">#${issue.id}</span>
            <span style="font-size: 10px; font-weight: 600; text-transform: uppercase; color: ${markerColor};">${issue.status.replace('_', ' ')}</span>
          </div>
          <h4 style="font-size: 12px; font-weight: 700; color: #0f172a; margin: 0 0 4px 0; line-height: 1.3;">${issue.title}</h4>
          <p style="font-size: 11px; color: #64748b; margin: 0 0 6px 0;">📍 ${issue.location.address} (${issue.location.ward})</p>
          <div style="display: flex; align-items: center; justify-content: space-between; border-top: 1px solid #e2e8f0; padding-top: 6px; font-size: 11px;">
            <span style="color: #475569;">Dept: <strong>${issue.departmentName}</strong></span>
            <span style="font-weight: 700; color: #0f766e;">${issue.confirmationsCount} verified</span>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml);
      marker.on('click', () => {
        if (onSelectIssue) onSelectIssue(issue);
      });

      markersLayerRef.current?.addLayer(marker);
    });
  }, [issues, categoryFilter, statusFilter, onSelectIssue]);

  return (
    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
      {/* Map Control Bar */}
      <div className="p-3 border-b border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center space-x-2">
          <span className="font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-teal-700" />
            Civic Issue Map
          </span>
          <span className="text-slate-400">|</span>
          <span className="text-slate-500 font-medium">
            Showing {issues.length} active geolocated reports
          </span>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-2">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="bg-white border border-slate-300 rounded px-2.5 py-1 text-xs text-slate-800 font-medium focus:outline-none focus:border-teal-700"
          >
            <option value="all">All Statuses</option>
            <option value="open">Open / Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="bg-white border border-slate-300 rounded px-2.5 py-1 text-xs text-slate-800 font-medium focus:outline-none focus:border-teal-700"
          >
            <option value="all">All Categories</option>
            <option value="cat_road">Road & Potholes</option>
            <option value="cat_waste">Garbage & Waste</option>
            <option value="cat_streetlights">Streetlights</option>
            <option value="cat_water">Water & Drainage</option>
            <option value="cat_public_spaces">Public Spaces</option>
            <option value="cat_traffic">Traffic & Signage</option>
          </select>

          <button
            onClick={() => {
              if (mapInstanceRef.current) {
                mapInstanceRef.current.setView([28.6145, 77.2090], 14);
              }
            }}
            className="p-1 rounded text-slate-600 hover:text-slate-900 bg-white border border-slate-300 hover:bg-slate-50"
            title="Reset Map Center"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Map Container */}
      <div ref={mapContainerRef} style={{ height, width: '100%' }} />
    </div>
  );
};
