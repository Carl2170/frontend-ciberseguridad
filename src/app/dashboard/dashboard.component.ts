import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  MonitoringService,
  MonitoringData,
} from '../services/monitoring.service';
import { AuthService } from '../services/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  providers: [MonitoringService, AuthService],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit, OnDestroy {
  monitoringData: MonitoringData[] | null = null;
  filteredData: MonitoringData[] = [];
  availableEventTypes: string[] = [];
  selectedEventType: string = '';

  isLoading: boolean = true;
  errorMessage: string | null = null;

  pollingInterval: any;
  newDataLoading: boolean = false;
  showNewDataBanner: boolean = false;  // Nueva bandera para mostrar la notificación
  fadingOut: boolean = false;   

  eventTypeDescriptions: { [key: string]: string } = {
  'login': 'Eventos relacionados con inicio de sesión.',
  'logout': 'Eventos de cierre de sesión del usuario.',
  'sql_injection_attempt': 'Detección de intentos de inyección SQL.',
  'xss_attempt': 'Detección de ataques Cross-Site Scripting.',
  'rate_limit_exceeded': 'Intentos de acceso mediante fuerza bruta.',
  'path_traversal_attempt': 'Accesos denegados por políticas de seguridad.',
  // Agrega más según tus tipos
};
  private dataSubscription: Subscription | undefined;

  constructor(
    private router: Router,
    private monitoringService: MonitoringService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadMonitoringData();
  }

  loadMonitoringData(): void {
    if (this.authService.getAccessToken()) {
      this.dataSubscription = this.monitoringService.getData().subscribe({
        next: (data) => {
          this.monitoringData = data;
          this.filteredData = [...data]; // Inicialmente sin filtro
          this.availableEventTypes = Array.from(
            new Set(data.map((e) => e.event_type))
          );
          this.isLoading = false;
          //  this.startPolling(); // Inicia el polling para actualizaciones
        },
        error: (error) => {
          this.errorMessage =
            'Error al cargar los datos de monitoreo: ' +
            (error.error?.message || error.message);
          this.isLoading = false;
          console.error('Error al cargar los datos de monitoreo:', error);
        },
      });
    } else {
      this.errorMessage =
        'No se puede cargar los datos. Por favor, inicia sesión de nuevo.';
      this.isLoading = false;
      this.router.navigate(['/auth/login']);
    }
  }

  applyFilter(): void {
    if (!this.selectedEventType) {
      this.filteredData = [...(this.monitoringData || [])];
    } else {
      this.filteredData = (this.monitoringData || []).filter(
        (event) => event.event_type === this.selectedEventType
      );
    }
  }

  getBoliviaTime(utcString: string): string {
    try {
      const utcDate = new Date(utcString + 'Z');
      return utcDate.toLocaleString('es-BO', {
        timeZone: 'America/La_Paz',
        dateStyle: 'short',
        timeStyle: 'short',
      });
    } catch (error) {
      console.error('Error al convertir fecha:', utcString);
      return 'Fecha inválida';
    }
  }

  startPolling(): void {
    this.pollingInterval = setInterval(() => {
      this.monitoringService.getData().subscribe({
        next: (data) => {
          if (!this.monitoringData) return;

          const currentIds = new Set(this.monitoringData.map((e) => e.id));
          const newEntries = data.filter((e) => !currentIds.has(e.id));

          if (newEntries.length > 0) {
            this.showNewDataBanner = true;  // Mostrar notificación
            this.fadingOut = false;

            setTimeout(() => {
              this.fadingOut = true; // Iniciar animación salida
            }, 1800); // Después de 1.8s empieza el fade-out

            setTimeout(() => {
              this.showNewDataBanner = false; // Ocultar notificación
              this.fadingOut = false;

              this.monitoringData = data;
              this.applyFilter(); // Mantiene filtro actual
            }, 5000); // Ocultar después de 5s
          }
        },
        error: (error) => {
          console.error('Error en polling:', error);
        },
      });
    }, 10000); // Cada 10 segundos
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  ngOnDestroy(): void {
    this.dataSubscription?.unsubscribe();
    if (this.pollingInterval) clearInterval(this.pollingInterval);
  }
}
