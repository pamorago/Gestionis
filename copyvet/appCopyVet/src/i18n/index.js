import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Traducciones en español
const es = {
  translation: {
    // Navegación
    tickets: "TICKETS",
    createTicket: "CREAR TICKET",
    veterinarians: "VETERINARIOS",
    categories: "CATEGORÍAS",
    
    // Formulario de ticket
    title: "Título",
    description: "Descripción",
    appointmentDate: "Fecha cita",
    category: "Categoría",
    pet: "Mascota",
    assignedVeterinarian: "Veterinario asignado",
    selectCategory: "-- Seleccionar categoría --",
    selectVeterinarian: "-- Seleccionar veterinario --",
    createTicketButton: "Crear Ticket",
    
    // Estados y prioridades
    urgent: "Urgente",
    highPriority: "Alta Prioridad", 
    normal: "Normal",
    lowPriority: "Baja Prioridad",
    
    // Categorías
    vaccination: "Vacunación",
    minorSurgery: "Cirugía menor",
    deworming: "Desparasitación",
    generalConsultation: "Consulta general",
    emergency: "Emergencia",
    majorSurgery: "Cirugía mayor",
    exoticSpecies: "Especies Exóticas",
    dermatology: "Dermatología",
    traumatology: "Traumatología",
    routineControl: "Control rutinario",
    
    // Mensajes
    loading: "Cargando...",
    error: "Error",
    success: "Éxito",
    userNotAuthenticated: "Usuario no autenticado",
    errorCreatingTicket: "Error al crear el ticket. Por favor intente nuevamente.",
    errorLoadingData: "Error cargando datos necesarios para el formulario",
    
    // Usuario
    userCreatorId: "ID Usuario creador (no editable)",
    notAuthenticated: "no autenticado",
    connectedAs: "Conectado como",
    role: "Rol",
    userId: "Usuario ID",
    noUserAuthenticated: "No hay usuario autenticado",
    
    // Lista de tickets
    noStatus: "Sin estado",
    client: "Cliente",
    assignedTo: "Asignado a",
    priority: "Prioridad",
    created: "Creado",
    loadingTickets: "Cargando tickets",
    noTicketsFound: "No se encontraron tickets para mostrar",
    
    // Página de bienvenida
    veterinaryTicketManagement: "Sistema de Gestión de Tickets Veterinarios",
    connectPetOwners: "Conectamos a dueños de mascotas con veterinarios profesionales de manera eficiente y organizada",
    whoWeAre: "¿Quiénes Somos",
    aboutDescription1: "CopyVet es una plataforma innovadora diseñada para facilitar la comunicación y gestión de servicios veterinarios. Nuestro sistema de tickets permite a los dueños de mascotas crear solicitudes de atención médica de manera rápida y sencilla, mientras que los veterinarios pueden gestionar su carga de trabajo de forma eficiente.",
    aboutDescription2: "Con más de 5 años de experiencia en el sector, nos hemos consolidado como la solución líder para clínicas veterinarias que buscan modernizar sus procesos.",
    veterinarySystemAlt: "Sistema de tickets veterinarios",
    ourServices: "Nuestros Servicios",
    personalizedCare: "Atención Personalizada",
    personalizedCareDescription: "Cada mascota es única. Nuestro sistema permite registrar información detallada de cada paciente, incluyendo historial médico, raza, edad y condiciones especiales.",
    certifiedVeterinarians: "Veterinarios Certificados",
    certifiedVeterinariansDescription: "Contamos con un equipo de veterinarios altamente calificados y especializados en diversas áreas como medicina interna, cirugía, dermatología y más.",
    ticketManagement: "Gestión de Tickets",
    ticketManagementDescription: "Sistema inteligente de asignación de tickets que prioriza casos urgentes y distribuye la carga de trabajo equitativamente entre veterinarios.",
    support247: "Soporte 24/7",
    support247Description: "Nuestro equipo de atención al cliente está disponible las 24 horas del día, los 7 días de la semana para resolver cualquier duda o emergencia.",
    ourMission: "Nuestra Misión",
    missionDescription: "Proporcionar una plataforma tecnológica que mejore la calidad de atención veterinaria, facilitando la comunicación entre clientes y profesionales, optimizando procesos y garantizando el bienestar de las mascotas.",
    ourVision: "Nuestra Visión",
    visionDescription: "Ser la plataforma líder en gestión de servicios veterinarios en América Latina, reconocida por nuestra innovación tecnológica, excelencia en el servicio y compromiso con el bienestar animal.",
    readyToStart: "¿Listo para comenzar",
    joinSatisfiedClients: "Únete a cientos de clientes satisfechos que confían en CopyVet",
    registerNow: "Registrarse Ahora",
    changeLanguage: "Cambiar idioma",
    
    // Especies y razas
    dog: "Perro",
    cat: "Gato",
    rabbit: "Conejo",
    bird: "Ave",
    noSpecies: "Sin especie",
    noBreed: "Sin raza definida",
    owner: "Dueño",
    notRegistered: "No registrado"
  }
};

// Traducciones en inglés
const en = {
  translation: {
    // Navigation
    tickets: "TICKETS",
    createTicket: "CREATE TICKET",
    veterinarians: "VETERINARIANS",
    categories: "CATEGORIES",
    
    // Ticket form
    title: "Title",
    description: "Description",
    appointmentDate: "Appointment Date",
    category: "Category",
    pet: "Pet",
    assignedVeterinarian: "Assigned Veterinarian",
    selectCategory: "-- Select category --",
    selectVeterinarian: "-- Select veterinarian --",
    createTicketButton: "Create Ticket",
    
    // States and priorities
    urgent: "Urgent",
    highPriority: "High Priority",
    normal: "Normal", 
    lowPriority: "Low Priority",
    
    // Categories
    vaccination: "Vaccination",
    minorSurgery: "Minor Surgery",
    deworming: "Deworming",
    generalConsultation: "General Consultation",
    emergency: "Emergency",
    majorSurgery: "Major Surgery",
    exoticSpecies: "Exotic Species",
    dermatology: "Dermatology",
    traumatology: "Traumatology",
    routineControl: "Routine Control",
    
    // Messages
    loading: "Loading...",
    error: "Error",
    success: "Success",
    userNotAuthenticated: "User not authenticated",
    errorCreatingTicket: "Error creating ticket. Please try again.",
    errorLoadingData: "Error loading data needed for the form",
    
    // User
    userCreatorId: "Creator User ID (non-editable)",
    notAuthenticated: "not authenticated",
    connectedAs: "Connected as",
    role: "Role",
    userId: "User ID",
    noUserAuthenticated: "No user authenticated",
    
    // Ticket list
    noStatus: "No status",
    client: "Client",
    assignedTo: "Assigned to",
    priority: "Priority",
    created: "Created",
    loadingTickets: "Loading tickets",
    noTicketsFound: "No tickets found to display",
    
    // Welcome page
    veterinaryTicketManagement: "Veterinary Ticket Management System",
    connectPetOwners: "We connect pet owners with professional veterinarians efficiently and organized",
    whoWeAre: "Who We Are",
    aboutDescription1: "CopyVet is an innovative platform designed to facilitate communication and management of veterinary services. Our ticket system allows pet owners to create medical care requests quickly and easily, while veterinarians can manage their workload efficiently.",
    aboutDescription2: "With more than 5 years of experience in the sector, we have established ourselves as the leading solution for veterinary clinics looking to modernize their processes.",
    veterinarySystemAlt: "Veterinary ticket system",
    ourServices: "Our Services",
    personalizedCare: "Personalized Care",
    personalizedCareDescription: "Every pet is unique. Our system allows detailed patient information to be recorded, including medical history, breed, age and special conditions.",
    certifiedVeterinarians: "Certified Veterinarians",
    certifiedVeterinariansDescription: "We have a team of highly qualified veterinarians specializing in various areas such as internal medicine, surgery, dermatology and more.",
    ticketManagement: "Ticket Management",
    ticketManagementDescription: "Intelligent ticket assignment system that prioritizes urgent cases and distributes workload equitably among veterinarians.",
    support247: "24/7 Support",
    support247Description: "Our customer service team is available 24 hours a day, 7 days a week to resolve any questions or emergencies.",
    ourMission: "Our Mission",
    missionDescription: "To provide a technological platform that improves the quality of veterinary care, facilitating communication between clients and professionals, optimizing processes and guaranteeing the welfare of pets.",
    ourVision: "Our Vision",
    visionDescription: "To be the leading platform in veterinary services management in Latin America, recognized for our technological innovation, service excellence and commitment to animal welfare.",
    readyToStart: "Ready to get started",
    joinSatisfiedClients: "Join hundreds of satisfied customers who trust CopyVet",
    registerNow: "Register Now",
    changeLanguage: "Change language",
    
    // Species and breeds
    dog: "Dog",
    cat: "Cat",
    rabbit: "Rabbit",
    bird: "Bird",
    noSpecies: "No species",
    noBreed: "No breed defined",
    owner: "Owner",
    notRegistered: "Not registered"
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      es,
      en
    },
    fallbackLng: 'es', // Español como idioma por defecto
    debug: false,
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;