import { Translations } from '@/lib/types';

export const translations: Translations = {
  // Navigation
  'nav.dashboard': { en: 'Dashboard', es: 'Panel de Control' },
  'nav.admin': { en: 'Admin', es: 'Administración' },
  'nav.analytics': { en: 'Analytics', es: 'Analíticas' },

  // Flag Status
  'flag.green': { en: 'Low Risk', es: 'Bajo Riesgo' },
  'flag.yellow': { en: 'Moderate Risk', es: 'Riesgo Moderado' },
  'flag.red': { en: 'High Risk', es: 'Alto Riesgo' },
  'flag.green.desc': {
    en: 'Safe conditions for swimming and water activities',
    es: 'Condiciones seguras para nadar y actividades acuáticas',
  },
  'flag.yellow.desc': {
    en: 'Caution advised - moderate hazards present',
    es: 'Se recomienda precaución - peligros moderados presentes',
  },
  'flag.red.desc': {
    en: 'Dangerous conditions - swimming not recommended',
    es: 'Condiciones peligrosas - no se recomienda nadar',
  },

  // Beach Conditions
  'conditions.waveHeight': { en: 'Wave Height', es: 'Altura de Olas' },
  'conditions.windSpeed': { en: 'Wind Speed', es: 'Velocidad del Viento' },
  'conditions.windDirection': { en: 'Wind Direction', es: 'Dirección del Viento' },
  'conditions.waterTemp': { en: 'Water Temperature', es: 'Temperatura del Agua' },
  'conditions.airTemp': { en: 'Air Temperature', es: 'Temperatura del Aire' },
  'conditions.uvIndex': { en: 'UV Index', es: 'Índice UV' },
  'conditions.tideStatus': { en: 'Tide Status', es: 'Estado de Marea' },

  // Hazards
  'hazard.rip-currents': { en: 'Rip Currents', es: 'Corrientes de Resaca' },
  'hazard.high-surf': { en: 'High Surf', es: 'Oleaje Alto' },
  'hazard.jellyfish': { en: 'Jellyfish', es: 'Medusas' },
  'hazard.sharks': { en: 'Shark Activity', es: 'Actividad de Tiburones' },
  'hazard.water-quality': {
    en: 'Water Quality Advisory',
    es: 'Aviso de Calidad del Agua',
  },
  'hazard.sneaker-waves': { en: 'Sneaker Waves', es: 'Olas Traidoras' },
  'hazard.wildlife': { en: 'Wildlife Present', es: 'Vida Silvestre Presente' },
  'hazard.strong-winds': { en: 'Strong Winds', es: 'Vientos Fuertes' },

  // UI Labels
  'ui.activeHazards': { en: 'Active Hazards', es: 'Peligros Activos' },
  'ui.currentConditions': { en: 'Current Conditions', es: 'Condiciones Actuales' },
  'ui.advisory': { en: 'Advisory', es: 'Aviso' },
  'ui.lastUpdated': { en: 'Last Updated', es: 'Última Actualización' },
  'ui.dataSource': { en: 'Data Source', es: 'Fuente de Datos' },
  'ui.search': { en: 'Search beaches...', es: 'Buscar playas...' },
  'ui.filterByRegion': { en: 'Filter by Region', es: 'Filtrar por Región' },
  'ui.filterByFlag': { en: 'Filter by Flag Status', es: 'Filtrar por Estado de Bandera' },
  'ui.allRegions': { en: 'All Regions', es: 'Todas las Regiones' },
  'ui.allFlags': { en: 'All Flags', es: 'Todas las Banderas' },
  'ui.selectBeach': {
    en: 'Select a beach to view details',
    es: 'Seleccione una playa para ver detalles',
  },

  // Regions
  'region.North': { en: 'North Coast', es: 'Costa Norte' },
  'region.Central': { en: 'Central Coast', es: 'Costa Central' },
  'region.South': { en: 'South Coast', es: 'Costa Sur' },

  // Admin Panel
  'admin.title': { en: 'Admin Panel', es: 'Panel de Administración' },
  'admin.selectBeach': { en: 'Select Beach', es: 'Seleccionar Playa' },
  'admin.setFlag': { en: 'Set Safety Flag', es: 'Establecer Bandera de Seguridad' },
  'admin.advisory': { en: 'Custom Advisory Message', es: 'Mensaje de Aviso Personalizado' },
  'admin.hazards': { en: 'Active Hazards', es: 'Peligros Activos' },
  'admin.save': { en: 'Save Changes', es: 'Guardar Cambios' },
  'admin.updateLog': { en: 'Recent Updates', es: 'Actualizaciones Recientes' },
  'admin.success': { en: 'Changes saved successfully', es: 'Cambios guardados exitosamente' },

  // Analytics
  'analytics.title': { en: 'Analytics Dashboard', es: 'Panel de Analíticas' },
  'analytics.totalVisits': { en: 'Total Visits This Month', es: 'Visitas Totales Este Mes' },
  'analytics.popularBeaches': { en: 'Most Viewed Beaches', es: 'Playas Más Vistas' },
  'analytics.deviceBreakdown': {
    en: 'Device Breakdown',
    es: 'Desglose por Dispositivo',
  },
  'analytics.peakUsage': { en: 'Peak Usage Times', es: 'Horarios Pico de Uso' },
  'analytics.mobile': { en: 'Mobile', es: 'Móvil' },
  'analytics.desktop': { en: 'Desktop', es: 'Escritorio' },
  'analytics.tablet': { en: 'Tablet', es: 'Tableta' },

  // Footer
  'footer.poweredBy': { en: 'Powered by', es: 'Desarrollado por' },
  'footer.dataSources': { en: 'Data Sources', es: 'Fuentes de Datos' },
  'footer.copyright': { en: '© 2026 County of San Mateo', es: '© 2026 Condado de San Mateo' },

  // Header
  'header.title': {
    en: 'San Mateo County Beach Safety Dashboard',
    es: 'Panel de Seguridad en las Playas del Condado de San Mateo',
  },
};
