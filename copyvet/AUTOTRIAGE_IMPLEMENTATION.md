# Implementación Autotriage - Plan

## Resumen de lo que necesitamos:

### 1. Frontend - Cálculo de puntaje

```javascript
// Fórmula: puntaje = (prioridad * 1000) - tiempoRestanteSLA
// prioridad: id_sla (1=Urgente, 2=Alta, 3=Normal, 4=Baja)
// tiempoRestanteSLA: tiempo_minutos - tiempo_transcurrido
```

### 2. Datos necesarios de la categoría:

- id_sla (prioridad)
- tiempo_minutos (del SLA)
- tiempo_resolucion

### 3. Datos necesarios del veterinario:

- id_veterinario
- nombre_completo
- especialidades
- carga_actual

### 4. Mostrar al usuario:

- Puntaje calculado para cada veterinario
- Veterinario seleccionado (mayor puntaje)
- Justificación: "Asignado por [razón]: Puntaje X, Carga Y horas"
- Tabla comparativa de todos los veterinarios disponibles

### 5. Implementación:

- Modificar cargarEtiquetasDeCategoria para también obtener datos de SLA
- Crear función calcularAutotriage()
- Crear modal/diálogo AutoTriageDialog
- Guardar resultado en estado autoTriageResult
- Mostrar antes de crear el ticket (opcional) o en consola/log
