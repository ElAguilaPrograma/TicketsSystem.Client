// Ejemplo de uso del componente Select

import { Component } from '@angular/core';
import { SelectComponent, SelectOption } from './select';

@Component({
  selector: 'app-select-example',
  standalone: true,
  imports: [SelectComponent],
  template: `
    <div class="space-y-6 p-6">
      <!-- Ejemplo 1: Select básico -->
      <app-select
        [options]="statusOptions"
        [selectedValue]="selectedStatus"
        placeholder="Seleccionar estado"
        label="Estado del Ticket"
        variant="primary"
        (selectionChange)="onStatusChange($event)"
      />

      <!-- Ejemplo 2: Select searchable -->
      <app-select
        [options]="priorityOptions"
        [selectedValue]="selectedPriority"
        placeholder="Buscar prioridad..."
        label="Prioridad"
        variant="secondary"
        [searchable]="true"
        (selectionChange)="onPriorityChange($event)"
      />

      <!-- Ejemplo 3: Select con error -->
      <app-select
        [options]="departmentOptions"
        [selectedValue]="selectedDepartment"
        placeholder="Seleccionar departamento"
        label="Departamento"
        variant="outline"
        [required]="true"
        [errorMessage]="departmentError"
        (selectionChange)="onDepartmentChange($event)"
      />

      <!-- Ejemplo 4: Select deshabilitado -->
      <app-select
        [options]="assigneeOptions"
        [selectedValue]="selectedAssignee"
        placeholder="Asignado a"
        label="Asignado"
        [disabled]="true"
      />
    </div>
  `
})
export class SelectExampleComponent {
  selectedStatus = 'open';
  selectedPriority = 'medium';
  selectedDepartment: string | null = null;
  selectedAssignee = 'john_doe';
  departmentError = '';

  statusOptions: SelectOption[] = [
    { label: 'Abierto', value: 'open' },
    { label: 'En Progreso', value: 'in_progress' },
    { label: 'Cerrado', value: 'closed' },
    { label: 'En Espera', value: 'pending', disabled: true }
  ];

  priorityOptions: SelectOption[] = [
    { label: 'Baja', value: 'low' },
    { label: 'Media', value: 'medium' },
    { label: 'Alta', value: 'high' },
    { label: 'Crítica', value: 'critical' }
  ];

  departmentOptions: SelectOption[] = [
    { label: 'Soporte Técnico', value: 'technical' },
    { label: 'Ventas', value: 'sales' },
    { label: 'Recursos Humanos', value: 'hr' },
    { label: 'Finanzas', value: 'finance' }
  ];

  assigneeOptions: SelectOption[] = [
    { label: 'John Doe', value: 'john_doe' },
    { label: 'Jane Smith', value: 'jane_smith' },
    { label: 'Carlos López', value: 'carlos_lopez' }
  ];

  onStatusChange(value: any) {
    this.selectedStatus = value;
    console.log('Estado seleccionado:', value);
  }

  onPriorityChange(value: any) {
    this.selectedPriority = value;
    console.log('Prioridad seleccionada:', value);
  }

  onDepartmentChange(value: any) {
    this.selectedDepartment = value;
    this.departmentError = '';
    console.log('Departamento seleccionado:', value);
  }
}
