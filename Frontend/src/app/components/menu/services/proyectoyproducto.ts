import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Producto } from '../modelo/productos';
import { Proyecto } from '../modelo/proyectos';
import { AutenticacionService } from './autenticacion';
@Injectable({
  providedIn: 'root' // Asegúrate de tener este providedIn en tu servicio
})

export class ProyectoyproductoService {
  
  constructor(private http: HttpClient,private  AutenticacionService:AutenticacionService) { }
  
  //Mostrar proyectos y productos

  private apiUrl3 = 'http://localhost:8000/proyecto';
  private apiEstadoProyecto = 'http://localhost:8000/estadoproyecto';

  getProyectos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl3}`);
  }
  
  private apiUrl4 = 'http://localhost:8000/producto';
  getProductos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl4}`);
  }
  //proyectos del investigador autenticado
  getProyectosDelUsuario(): Observable<any[]> {
    const numeroDocumento = this.AutenticacionService.obtenerDatosUsuario().numerodocumento; // Suponiendo que 'numeroDocumento' es la clave que contiene el número de documento en los datos del usuario
    return this.http.get<any[]>(this.apiUrl3).pipe(
      map((proyectos: any[]) => proyectos.filter(proyecto => proyecto.investigador === numeroDocumento))
  );
  }

  private apiUrl5 = 'http://localhost:8000/mostrarProductos';

  getProductosDelUsuario(): Observable<any[]> {
    const numeroDocumento = this.AutenticacionService.obtenerDatosUsuario().numerodocumento;
    console.log('Número de documento del usuario:', numeroDocumento);

    return this.http.get<any[]>(this.apiUrl5).pipe(
        map((productos: any[]) => {
            console.log('Productos obtenidos del servidor:', productos.filter(producto => producto.investigador.numerodocumento === numeroDocumento));
            return productos.filter(producto => producto.investigador.numerodocumento === numeroDocumento);
        })
    );
}


  //Crear proyectos y productos
    private apiUrl = 'http://localhost:8000/CrearProyecto';
    
    
    crearProyecto(proyecto: Proyecto): Observable<Proyecto> {
      return this.http.post<Proyecto>(this.apiUrl, proyecto);
  }
    
    
    
  private apiUrl2 = 'http://localhost:8000/CrearProducto';
  crearProducto(producto: Producto): Observable<Producto> {
    const datos = { producto };
    console.log(datos);
    return this.http.post<Producto>(this.apiUrl2, datos);
  }

  getEstadoProyecto(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiEstadoProyecto}`);
  }
  

}