import statistics
from http.client import responses
from telnetlib import STATUS
from urllib import response

from django.forms import ValidationError
from rest_framework import generics, status
from rest_framework.response import Response

from .models import (Apropiacion, Articulos, AvanceProyecto, Capitulos,
                     CategoriaMinciencias, Consultoria, Contenido, Contrato,
                     CuartilEsperado, EntidadPostulo, EntregableAdministrativo,
                     EstadoProducto, EstadoProyecto, Estudiantes, Eventos,
                     Financiacion, Grupoinvestigacion, Imagen, Industrial,
                     Investigador, Libros, Licencia, ListaProducto, Maestria,
                     ParticipantesExternos, Posgrado, PregFinalizadoyCurso,
                     Pregrado, Producto, Proyecto, Reconocimientos, Software,
                     TipoEventos, Transacciones, Ubicacion, UbicacionProyecto)
from .serializer import (apropiacionSerializer, articulosSerializer,
                         avanceProyectoSerializer, capitulosSerializer,
                         categoriaMincienciasSerializer, consultoriaSerializer,
                         contenidoSerializer, contratoSerializer,
                         cuartilEsperadoSerializer, entidadPostuloSerializer,
                         entregableAdministrativoSerializer,
                         estadoProductoSerializer, estadoProyecotSerializer,
                         estudiantesSerializer, eventosSerializer,
                         financiacionSerializer, grupoinvestigacionSerializer,
                         imagenSerializer, industrialSerializer,
                         investigadorSerializer, librosSerializer,
                         licenciaSerializer, listaProductoSerializer,
                         maestriaSerializer, participantesExternosSerializer,
                         posgradoSerializer, pregFinalizadoyCursoSerializer,
                         pregradoSerializer, productoSerializer,
                         proyectoSerializer, reconocimientosSerializer,
                         softwareSerializer, tipoEventoSerializer,
                         transaccionesSerializer, ubicacionProyectoSerializer,
                         ubicacionSerializer)

#------------------------ investigador ------------------------

class investigadorList(generics.ListCreateAPIView):
    queryset = Investigador.objects.all()
    serializer_class = investigadorSerializer
    
class imagenList(generics.ListCreateAPIView):
    queryset = Imagen.objects.all()
    serializer_class = imagenSerializer

class grupoInvestigacionList(generics.ListCreateAPIView):
    queryset = Grupoinvestigacion.objects.all()
    serializer_class = grupoinvestigacionSerializer

class posgradoList(generics.ListCreateAPIView):
    queryset = Posgrado.objects.all()
    serializer_class = posgradoSerializer

class pregradoList(generics.ListCreateAPIView):
    queryset = Pregrado.objects.all()
    serializer_class = pregradoSerializer

class ubicacionList(generics.ListCreateAPIView):
    queryset = Ubicacion.objects.all()
    serializer_class = ubicacionSerializer

class investigadorRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = Investigador.objects.all()
    serializer_class = investigadorSerializer

class imagenRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = Imagen.objects.all()
    serializer_class = imagenSerializer

class grupoInvestigacionRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = Grupoinvestigacion.objects.all()
    serializer_class = grupoinvestigacionSerializer

class posgradoRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = Posgrado.objects.all()
    serializer_class = posgradoSerializer

class pregradoRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = Pregrado.objects.all()
    serializer_class = pregradoSerializer

class ubicacionRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = Ubicacion.objects.all()
    serializer_class = ubicacionSerializer


#---------------------------- PRODUCTOS ----------------------------

class eventosList(generics.ListCreateAPIView):
    queryset = Eventos.objects.all()
    serializer_class = eventosSerializer

class articulosList(generics.ListCreateAPIView):
    queryset = Articulos.objects.all()
    serializer_class = articulosSerializer

class capitulosList(generics.ListCreateAPIView):
    queryset = Capitulos.objects.all()
    serializer_class = capitulosSerializer

class librosList(generics.ListCreateAPIView):
    queryset = Libros.objects.all()
    serializer_class = librosSerializer

class softwareList(generics.ListCreateAPIView):
    queryset = Software.objects.all()
    serializer_class = softwareSerializer

class industrialList(generics.ListCreateAPIView):
    queryset = Industrial.objects.all()
    serializer_class = industrialSerializer

class reconocimientosList(generics.ListCreateAPIView):
    queryset = Reconocimientos.objects.all()
    serializer_class = reconocimientosSerializer

class licenciaList(generics.ListCreateAPIView):
    queryset = Licencia.objects.all()
    serializer_class = licenciaSerializer

class apropiacionList(generics.ListCreateAPIView):
    queryset = Apropiacion.objects.all()
    serializer_class = apropiacionSerializer

class contratoList(generics.ListCreateAPIView):
    queryset = Contrato.objects.all()
    serializer_class = contratoSerializer

class consultoriaList(generics.ListCreateAPIView):
    queryset = Consultoria.objects.all()
    serializer_class = consultoriaSerializer

class contenidoList(generics.ListCreateAPIView):
    queryset = Contenido.objects.all()
    serializer_class = contenidoSerializer

class pregFinalizadoyCursoList(generics.ListCreateAPIView):
    queryset = PregFinalizadoyCurso.objects.all()
    serializer_class = pregFinalizadoyCursoSerializer

class maeestriaList(generics.ListCreateAPIView):
    queryset = Maestria.objects.all()
    serializer_class = maestriaSerializer

class listaProductoList(generics.ListCreateAPIView):
    queryset = ListaProducto.objects.all()
    serializer_class = listaProductoSerializer


class estudiantesList(generics.ListCreateAPIView):
    queryset = Estudiantes.objects.all()
    serializer_class = estudiantesSerializer


class productoList(generics.ListCreateAPIView):
    queryset = Producto.objects.all()
    serializer_class = productoSerializer

class participantesExternosList(generics.ListCreateAPIView):
    queryset = ParticipantesExternos.objects.all()
    serializer_class = participantesExternosSerializer

class tipoEventoList(generics.ListCreateAPIView):
    queryset = TipoEventos.objects.all()
    serializer_class = tipoEventoSerializer

class categoriaMincienciasList(generics.ListCreateAPIView):
    queryset = CategoriaMinciencias.objects.all()
    serializer_class = categoriaMincienciasSerializer

class cuartilEsperadoList(generics.ListCreateAPIView):
    queryset = CuartilEsperado.objects.all()
    serializer_class = cuartilEsperadoSerializer

class estadoProductoList(generics.ListCreateAPIView):
    queryset = EstadoProducto.objects.all()
    serializer_class = estadoProductoSerializer

class eventoRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = Eventos.objects.all()
    serializer_class = eventosSerializer

class articuloRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = Articulos.objects.all()
    serializer_class = articulosSerializer

class capituloRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = Capitulos.objects.all()
    serializer_class = capitulosSerializer

class libroRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = Libros.objects.all()
    serializer_class = librosSerializer

class softwareRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = Software.objects.all()
    serializer_class = softwareSerializer

class industrialRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = Industrial.objects.all()
    serializer_class = industrialSerializer

class reconocimientoRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = Reconocimientos.objects.all()
    serializer_class = reconocimientosSerializer

class licenciaRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = Licencia.objects.all()
    serializer_class = licenciaSerializer

class apropiacionRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = Apropiacion.objects.all()
    serializer_class = apropiacionSerializer

class contratoRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = Contrato.objects.all()
    serializer_class = contratoSerializer

class consultoriaRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = Consultoria.objects.all()
    serializer_class = consultoriaSerializer

class contenidoRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = Contenido.objects.all()
    serializer_class = contenidoSerializer

class pregFinalizadoyCursoRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = PregFinalizadoyCurso.objects.all()
    serializer_class = pregFinalizadoyCursoSerializer

class maeestriaRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = Maestria.objects.all()
    serializer_class = maestriaSerializer

class listaProductoRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = ListaProducto.objects.all()
    serializer_class = listaProductoSerializer


class estudiantesRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = Estudiantes.objects.all()
    serializer_class = estudiantesSerializer

class productoRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = Producto.objects.all()
    serializer_class = productoSerializer

#---------------------------- PROYECTOS ----------------------------


class entidadPostuloList(generics.ListCreateAPIView):
    queryset = EntidadPostulo.objects.all()
    serializer_class = entidadPostuloSerializer

class financiacionList(generics.ListCreateAPIView):
    queryset = Financiacion.objects.all()
    serializer_class = financiacionSerializer

class transaccionesList(generics.ListCreateAPIView):
    queryset = Transacciones.objects.all()
    serializer_class = transaccionesSerializer

class ubicacionProyectoList(generics.ListCreateAPIView):
    queryset = UbicacionProyecto.objects.all()
    serializer_class = ubicacionProyectoSerializer

class avanceProyectoList(generics.ListCreateAPIView):
    queryset = AvanceProyecto.objects.all()
    serializer_class = avanceProyectoSerializer

class entregableAdministrativoList(generics.ListCreateAPIView):
    queryset = EntregableAdministrativo.objects.all()
    serializer_class = entregableAdministrativoSerializer

class estadoProyectoList(generics.ListCreateAPIView):
    queryset = EstadoProyecto.objects.all()
    serializer_class = estadoProyecotSerializer

class proyectoList(generics.ListCreateAPIView):
    queryset = Proyecto.objects.all()
    serializer_class = proyectoSerializer

class entidadPostuloRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = EntidadPostulo.objects.all()
    serializer_class = entidadPostuloSerializer

class financiacionRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = Financiacion.objects.all()
    serializer_class = financiacionSerializer

class transaccionesRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = Transacciones.objects.all()
    serializer_class = transaccionesSerializer

class ubicacionProyectoRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = UbicacionProyecto.objects.all()
    serializer_class = ubicacionProyectoSerializer

class avanceProyectoRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = AvanceProyecto.objects.all()
    serializer_class = avanceProyectoSerializer

class entregableAdministrativoRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = EntregableAdministrativo.objects.all()
    serializer_class = entregableAdministrativoSerializer

class proyectoRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = Proyecto.objects.all()
    serializer_class = proyectoSerializer
