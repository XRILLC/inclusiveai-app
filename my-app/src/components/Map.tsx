"use client";

import { useEffect, useRef } from 'react';

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { LanguageData } from '@/types';
import { useRouter } from 'next/navigation';



interface MapProps {
  languages: LanguageData[];
  selectedModels: string[];
}

export default function Map({ languages, selectedModels }: MapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const router = useRouter();

  const tileLayerRef = useRef<L.TileLayer | null>(null);

  useEffect(() => {
    if (!mapRef.current) {
      // Initialize map
      // Always use dark mode for map tiles
      const tileUrl = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';

      tileLayerRef.current = L.tileLayer(tileUrl, {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
      });

      mapRef.current = L.map('map', {
        center: [20, 0],
        zoom: 2,
        layers: [tileLayerRef.current]
      });
    }

    // Clear existing markers
    mapRef.current.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer instanceof L.Polyline) {
        layer.remove();
      }
    });

    // Add markers for each language
    languages.forEach((language) => {
      const modelsPresent = language.available_models?.filter(Boolean) || [];
      const modelsToShow = selectedModels.length > 0 
        ? modelsPresent.filter(m => selectedModels.includes(m))
        : modelsPresent;

      if (modelsToShow.length === 0 && selectedModels.length > 0) {
        return;
      }

      // Create marker HTML
      const markerHtml = createMarkerHtml(modelsToShow);
      
      // Create custom icon
      const icon = L.divIcon({
        html: markerHtml,
        className: 'custom-marker',
        iconSize: [24, 24]
      });

      // Create popup content with View Details button
      const popupContent = `
        <div class="min-w-[280px] p-5 bg-gray-900/95 text-white backdrop-blur-sm rounded-lg shadow-xl">
          <h3 class="text-xl font-bold mb-1 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">${language.name}</h3>
          <p class="text-sm text-black-400 mb-4">ISO Code: ${language.iso_code || 'undefined'}</p>
          
          ${modelsPresent.length > 0 ? `
            <div class="space-y-3 mb-4">
              <div class="flex gap-2">
                ${modelsPresent.map(model => `
                  <span class="px-3 py-1 rounded-full text-white text-xs font-medium bg-gradient-to-r ${model === 'ASR' ? 'from-rose-500 to-rose-600' : model === 'NMT' ? 'from-blue-500 to-blue-600' : 'from-green-500 to-green-600'}">
                    ${model}
                  </span>
                `).join('')}
              </div>
              <div class="flex items-center gap-2 text-sm">
                <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
                <span class="text-black-300">${language.nmt_pair_count || 0} NMT Pairs</span>
              </div>
            </div>
          ` : `
            <p class="text-sm text-gray-400 mb-4">No models available yet</p>
          `}
          
          <button
            class="view-details-btn w-full px-4 py-2.5 rounded-lg font-medium text-sm
            bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600
            transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]
            focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:ring-offset-2 focus:ring-offset-gray-900"
            data-language-id="${language.id}"
          >
            View Details
          </button>
        </div>
      `;

      // Add marker to map
      const marker = L.marker([language.latitude, language.longitude], { icon })
        .bindPopup(popupContent)
        .addTo(mapRef.current!);

      // Add click handler for View Details button
      marker.on('popupopen', () => {
        const btn = document.querySelector(`button[data-language-id="${language.id}"]`);
        if (btn) {
          btn.addEventListener('click', () => {
            router.push(`/language/${language.id}`);
          });
        }
      });

      // If language has NMT pairs and connected languages, draw connections
      if (language.connected_languages && language.connected_coords) {
        language.connected_coords.forEach((coords, index) => {
          if (coords && coords.length === 2) {
            const line = L.polyline(
              [[language.latitude, language.longitude], coords],
              {
                color: '#60A5FA',
                weight: 1.5,
                opacity: 0.4,
                dashArray: '6, 8',
                className: 'nmt-line'
              }
            ).addTo(mapRef.current!);



            // Add popup to line
            const pairPopup = `
              <div class="min-w-[240px] p-5 bg-gray-900/95 backdrop-blur-sm text-white rounded-lg shadow-xl">
                <h4 class="text-lg font-bold mb-1 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">Translation Pair</h4>
                <div class="mt-4 space-y-3">
                  <div class="flex items-center gap-2">
                    <div class="w-2 h-2 rounded-full bg-gradient-to-r from-indigo-400 to-cyan-400"></div>
                    <span class="text-sm text-gray-300">${language.name}</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <div class="w-2 h-2 rounded-full bg-gradient-to-r from-indigo-400 to-cyan-400"></div>
                    <span class="text-sm text-gray-300">${language.connected_languages?.[index]?.name || 'Unknown'}</span>
                  </div>
                </div>
              </div>
            `;
            line.bindPopup(pairPopup);
          }
        });
      }
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [languages, selectedModels, router]);

  return <div id="map" className="w-full h-full" />;
}

function createMarkerHtml(models: string[]): string {
  const getGradient = (model: string) => {
    switch(model) {
      case 'ASR':
        return 'from-rose-500 to-rose-600';
      case 'NMT':
        return 'from-blue-500 to-blue-600';
      case 'TTS':
        return 'from-green-500 to-green-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  if (models.length === 0) {
    return `
      <div class="w-6 h-6 rounded-full bg-gradient-to-br from-gray-500 to-gray-600 flex items-center justify-center">
        <div class="w-1.5 h-1.5 rounded-full bg-white/30"></div>
      </div>
    `;
  }

  if (models.length === 1) {
    return `
      <div class="w-6 h-6 rounded-full bg-gradient-to-br ${getGradient(models[0])} flex items-center justify-center">
        <div class="w-1.5 h-1.5 rounded-full bg-white/30"></div>
      </div>
    `;
  }

  // For multiple models, create a segmented circle
  const segmentSize = 360 / models.length;
  const segments = models.map((model, i) => {
    const rotation = i * segmentSize;
    return `
      <div 
        class="absolute inset-0 bg-gradient-to-br ${getGradient(model)}"
        style="clip-path: polygon(50% 50%, ${50 + 50 * Math.cos((rotation - 2) * Math.PI / 180)}% ${50 + 50 * Math.sin((rotation - 2) * Math.PI / 180)}%, ${50 + 50 * Math.cos((rotation + segmentSize + 2) * Math.PI / 180)}% ${50 + 50 * Math.sin((rotation + segmentSize + 2) * Math.PI / 180)}%, 50% 50%)"
      ></div>
    `;
  }).join('');

  return `
    <div class="relative w-6 h-6 rounded-full overflow-hidden flex items-center justify-center">
      ${segments}
      <div class="absolute inset-0 flex items-center justify-center">
        <div class="w-1.5 h-1.5 rounded-full bg-white/30"></div>
      </div>
    </div>
  `;
}
