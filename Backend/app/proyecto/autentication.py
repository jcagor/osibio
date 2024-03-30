from django.contrib.auth.hashers import check_password
from django.db import transaction
from django.http import Http404, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework import serializers, status
from rest_framework.exceptions import ValidationError
from rest_framework.parsers import FileUploadParser
from rest_framework.response import Response
from rest_framework.views import APIView, exception_handler
from rest_framework_simplejwt.tokens import RefreshToken

from .models import (Apropiacion, Articulos, Capitulos, Consultoria, Contenido,
                     Contrato, EntidadPostulo, EntregableAdministrativo,
                     Estudiantes, Eventos, Financiacion, Industrial,
                     Investigador, Libros, Licencia, ListaProducto, Maestria,
                     PregFinalizadoyCurso, Producto, Proyecto, Reconocimientos,
                     Software, Transacciones, UbicacionProyecto)
from .serializer import (investigadorSerializer, productoSerializer,
                         proyectoSerializer)


class CustomAuthToken(APIView):
    def post(self, request, *args, **kwargs):
        email = request.data.get('correo')
        password = request.data.get('contrasena')

        try:
            investigador = Investigador.objects.get(correo=email)
        except Investigador.DoesNotExist:
            print("Investigador no encontrado")
            return Response({'error': 'Credenciales inválidas'}, status=status.HTTP_401_UNAUTHORIZED)

        # Verificar la contraseña
        print("Contraseña almacenada en la base de datos:", investigador.contrasena)
        if not check_password(password, investigador.contrasena):
            print("Contraseña incorrecta")
            print("Contraseña almacenada en la base de datos:", investigador.contrasena)
            return Response({'error': 'Credenciales inválidas'}, status=status.HTTP_401_UNAUTHORIZED)

        # Generar tokens
        refresh = RefreshToken.for_user(investigador)
        access_token = {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'numerodocumento': investigador.numerodocumento,
            'rolinvestigador': investigador.rolinvestigador,
            'estado': investigador.estado
        }

        # Obtener y devolver datos del usuario
        user_data = {
            'nombre': investigador.nombre,
            'apellidos': investigador.apellidos,
            'correo': investigador.correo,
            'tipodocumento': investigador.tipodocumento,
            'numerodocumento': investigador.numerodocumento,
            'lineainvestigacion': investigador.lineainvestigacion,
            'escalofonodocente': investigador.escalofonodocente,
            'unidadacademica': investigador.unidadAcademica,
            'horariosformacion': investigador.horasformacion,
            'horariosestrictos': investigador.horasestricto,
            'tipPosgrado': {
                'id': investigador.tipPosgrado.id,
                'titulo': investigador.tipPosgrado.titulo,
                'fecha': investigador.tipPosgrado.fecha,
                'institucion': investigador.tipPosgrado.institucion,
                'tipo': investigador.tipPosgrado.tipo,
            },
            'tipPregrado': {
                'id': investigador.tipPregrado.id,
                'titulo': investigador.tipPregrado.titulo,
                'fecha': investigador.tipPregrado.fecha,
                'institucion': investigador.tipPregrado.institucion,
            },
        }
        return Response({'token': access_token, 'user_data': user_data}, status=status.HTTP_200_OK)

class ActualizarDatosUsuario(APIView):
    def put(self, request, *args, **kwargs):
        try:
            usuario = Investigador.objects.get(numerodocumento=request.data.get('numerodocumento'))
        except Investigador.DoesNotExist:
            return Response({'error': 'Usuario no encontrado'}, status=status.HTTP_404_NOT_FOUND)

        serializer = investigadorSerializer(usuario, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        

class CrearProyecto(APIView):
    parser_class = (FileUploadParser,)
    def post(self, request, *args, **kwargs):
        soporte = request.FILES.get('Soporte')
        data =request.data.get('proyecto')

        entidadPostulo_data= data.get('entidadPostulo')
        entidadPostulo_id = entidadPostulo_data.get('id')
        entidadPostulo_nombreIntitucion = entidadPostulo_data.get('nombreInstitucion')
        entidadPostulo_nombreGrupo = entidadPostulo_data.get('nombreGrupo')
        entidadPostulo,_=EntidadPostulo.objects.get_or_create(
            id=entidadPostulo_id,
            nombreInstitucion=entidadPostulo_nombreIntitucion,
            nombreGrupo=entidadPostulo_nombreGrupo
        )
        
        financiacion_data = data.get('financiacion')
        financiacion_id = financiacion_data.get('id')
        financiacion_valorPropuestoFin = financiacion_data.get('valorPropuestoFin')
        financiacion_valorEjecutadoFin = financiacion_data.get('valorEjecutadoFin')
        financiacion,_=Financiacion.objects.get_or_create(
            id=financiacion_id,
            valorPropuestoFin=financiacion_valorPropuestoFin,
            valorEjecutadoFin=financiacion_valorEjecutadoFin
        )

        transacciones_data = data.get('transacciones')
        transacciones_id= transacciones_data.get('id')
        transacciones_fecha=transacciones_data.get('fecha')
        transacciones_acta=transacciones_data.get('acta')
        transacciones_descripcion=transacciones_data.get('descripcion')
        transacciones,_=Transacciones.objects.get_or_create(
            id=transacciones_id,
            fecha=transacciones_fecha,
            acta=transacciones_acta,
            descripcion=transacciones_descripcion
        )

        ubicacionProyecto_data = data.get('ubicacionProyecto')
        ubicacionProyecto_id= ubicacionProyecto_data.get('id')
        ubicacionProyecto_instalacion= ubicacionProyecto_data.get('instalacion')
        ubicacionProyecto_municipio=ubicacionProyecto_data.get('municipio')
        ubicacionProyecto_pais=ubicacionProyecto_data.get('pais')
        ubicacionProyecto_departamento=ubicacionProyecto_data.get('departamento')
        ubicacionProyecto,_=UbicacionProyecto.objects.get_or_create(
            id=ubicacionProyecto_id,
            instalacion=ubicacionProyecto_instalacion,
            municipio=ubicacionProyecto_municipio,
            pais=ubicacionProyecto_pais,
            departamento=ubicacionProyecto_departamento
        )
        
        entregableAdministrativo_data = data.get('entregableAdministrativo')
        entregableAdministrativo_id=entregableAdministrativo_data.get('id')
        entregableAdministrativo_nombre=entregableAdministrativo_data.get('nombre')
        entregableAdministrativo_titulo=entregableAdministrativo_data.get('titulo')
        entregableAdministrativo_calidad=entregableAdministrativo_data.get('calidad')
        entregableAdministrativo_entregable=entregableAdministrativo_data.get('entregable')
        entregableAdministrativo_pendiente=entregableAdministrativo_data.get('pendiente')
        entregableAdministrativo_clasificacion=entregableAdministrativo_data.get('clasificacion')
        entregableAdministrativo,_=EntregableAdministrativo.objects.get_or_create(
            id=entregableAdministrativo_id,
            nombre=entregableAdministrativo_nombre,
            titulo=entregableAdministrativo_titulo,
            calidad=entregableAdministrativo_calidad,
            entregable=entregableAdministrativo_entregable,
            pendiente=entregableAdministrativo_pendiente,
            clasificacion=entregableAdministrativo_clasificacion
        )

        
        proyecto_data = {
            'codigo': data.get('codigo'),
            'fecha': data.get('fecha'),
            'titulo': data.get('titulo'),
            'investigadores': data.get('investigadores'),
            'area': data.get('area'),
            'porcentajeEjecucionCorte': data.get('porcentajeEjecucionCorte'),
            'grupoInvestigacionPro': data.get('grupoInvestigacionPro'),
            'porcentajeEjecucionFinCorte': data.get('porcentajeEjecucionFinCorte'),
            'porcentajeAvance': data.get('porcentajeAvance'),
            'origen': data.get('origen'),
            'convocatoria': data.get('convocatoria'),
            'estado': data.get('estado'),
            'modalidad': data.get('modalidad'),
            'nivelRiesgoEtico': data.get('nivelRiesgoEtico'),
            'lineaInvestigacion': data.get('lineaInvestigacion'),
            'etapa': data.get('etapa'),
            'unidadAcademica': data.get('unidadAcademica'),
        }
  
        proyecto_data['entidadPostulo'] = entidadPostulo
        proyecto_data['financiacion'] = financiacion
        proyecto_data['transacciones'] = transacciones
        proyecto_data['ubicacionProyecto']=ubicacionProyecto
        proyecto_data['entregableAdministrativo']=entregableAdministrativo
    
        
        proyecto = Proyecto.objects.create(**proyecto_data)  # Crea el objeto Proyecto con los datos relacionados

        coinvestigadores_ids = data.get('coinvestigadores')
        coinvestigadores = Investigador.objects.filter(numerodocumento__in=coinvestigadores_ids)

        proyecto.coinvestigadores.set(coinvestigadores)  # Asigna los coinvestigadores al proyecto usando set()

        if soporte:
            proyecto.Soporte = soporte
            proyecto.save()

        serializer = proyectoSerializer(proyecto)  # Serializa el proyecto creado

        return Response(serializer.data, status=status.HTTP_201_CREATED)



class CrearNuevoProducto(APIView):
    parser_class = (FileUploadParser,)

    def post(self, request, *args, **kwargs):
        soporte = request.FILES.get('Soporte')
        data = request.data.get('producto')
        print("Datos resividos",data)

        # Extraer los datos de listaProducto
        lista_producto_data = data.get('listaProducto')
        

        # Crear o obtener otros objetos relacionados según sea necesario
        # Crear o obtener objetos relacionados según sea necesario
        evento_data = lista_producto_data.get('evento', {})
        evento = None
        if evento_data:
            evento_id = evento_data.get('id')
            evento_fechainicio = evento_data.get('fechainicio')
            evento_fechafin = evento_data.get('fechafin')
            evento_numparticinerno = evento_data.get('numparticinerno')
            evento_numparticexterno = evento_data.get('numparticexterno')
            evento_tipoevento = evento_data.get('tipoevento')
            evento, _ = Eventos.objects.get_or_create(
                id=evento_id,
                fechainicio=evento_fechainicio,
                fechafin=evento_fechafin,
                numparticinerno=evento_numparticinerno,
                numparticexterno=evento_numparticexterno,
                tipoevento=evento_tipoevento
            )

        articulo_data = lista_producto_data.get('articulo', {})
        articulo = None
        if articulo_data:
            articulo_id = articulo_data.get('id')
            articulo_fuente = articulo_data.get('fuente')
            articulo, _ = Articulos.objects.get_or_create(
                id=articulo_id,
                fuente=articulo_fuente
            )

        capitulo_data = lista_producto_data.get('capitulo', {})
        capitulo = None
        if capitulo_data:
            capitulo_id = capitulo_data.get('id')
            capitulo_nombrepublicacion = capitulo_data.get('nombrepublicacion')
            capitulo_isbn = capitulo_data.get('isbn')
            capitulo_fecha = capitulo_data.get('fecha')
            capitulo_editorial = capitulo_data.get('editorial')
            capitulo, _ = Capitulos.objects.get_or_create(
                id=capitulo_id,
                nombrepublicacion=capitulo_nombrepublicacion,
                isbn=capitulo_isbn,
                fecha=capitulo_fecha,
                editorial=capitulo_editorial
            )

        libro_data = lista_producto_data.get('libro', {})
        libro = None
        if libro_data:
            libro_id = libro_data.get('id')
            libro_isbn = libro_data.get('isbn')
            libro_fecha = libro_data.get('fecha')
            libro_editorial = libro_data.get('editorial')
            libro_luegarpublicacion = libro_data.get('luegarpublicacion')
            libro, _ = Libros.objects.get_or_create(
                id=libro_id,
                isbn=libro_isbn,
                fecha=libro_fecha,
                editorial=libro_editorial,
                luegarpublicacion=libro_luegarpublicacion
            )

        software_data = lista_producto_data.get('software', {})
        software = None
        if software_data:
            software_id = software_data.get('id')
            software_tiporegistro = software_data.get('tiporegistro')
            software_numero = software_data.get('numero')
            software_fecha = software_data.get('fecha')
            software_pais = software_data.get('pais')
            software, _ = Software.objects.get_or_create(
                id=software_id,
                tiporegistro=software_tiporegistro,
                numero=software_numero,
                fecha=software_fecha,
                pais=software_pais
            )

        prototipoIndustrial_data = lista_producto_data.get('prototipoIndustrial', {})
        prototipoIndustrial = None
        if prototipoIndustrial_data:
            prototipoIndustrial_id = prototipoIndustrial_data.get('id')
            prototipoIndustrial_fecha = prototipoIndustrial_data.get('fecha')
            prototipoIndustrial_pais = prototipoIndustrial_data.get('pais')
            prototipoIndustrial_insitutofinanciador = prototipoIndustrial_data.get('insitutofinanciador')
            prototipoIndustrial, _ = Industrial.objects.get_or_create(
                id=prototipoIndustrial_id,
                fecha=prototipoIndustrial_fecha,
                pais=prototipoIndustrial_pais,
                insitutofinanciador=prototipoIndustrial_insitutofinanciador
            )

        reconocimiento_data = lista_producto_data.get('reconocimiento', {})
        reconocimiento = None
        if reconocimiento_data:
            reconocimiento_id = reconocimiento_data.get('id')
            reconocimiento_fecha = reconocimiento_data.get('fecha')
            reconocimiento_nombentidadotorgada = reconocimiento_data.get('nombentidadotorgada')
            reconocimiento, _ = Reconocimientos.objects.get_or_create(
                id=reconocimiento_id,
                fecha=reconocimiento_fecha,
                nombentidadotorgada=reconocimiento_nombentidadotorgada
            )

        consultoria_data = lista_producto_data.get('consultoria', {})
        contrato = None
        consultoria = None
        if consultoria_data:
            contrato_data = consultoria_data.get('contrato', {})
            contrato = None
            if contrato_data:
                contrato_id = contrato_data.get('id')
                contrato_nombre = contrato_data.get('nombre')
                contrato_numero = contrato_data.get('numero')
                contrato, _ = Contrato.objects.get_or_create(
                    id=contrato_id,
                    nombre=contrato_nombre,
                    numero=contrato_numero
                )
            consultoria_id = consultoria_data.get('id')
            consultoria_ano = consultoria_data.get('año')
            consultoria_nombreEntidad = consultoria_data.get('nombreEntidad')
            consultoria, _ = Consultoria.objects.get_or_create(
                id=consultoria_id,
                año=consultoria_ano,
                contrato=contrato,
                nombreEntidad=consultoria_nombreEntidad
            )

        apropiacion_data = lista_producto_data.get('apropiacion', {})
        licencias = None
        apropiacion = None

        if apropiacion_data:
            licencia_data = apropiacion_data.get('licencia', {})
            licencias = None
            if licencia_data:
                licencia_id = licencia_data.get('id')
                licencia_nombre = licencia_data.get('nombre')
                licencias, _ = Licencia.objects.get_or_create(
                    id=licencia_id,
                    nombre=licencia_nombre
                    )
            apropiacion_id = apropiacion_data.get('id')
            apropiacion_fechainicio = apropiacion_data.get('fechainicio')
            apropiacion_fechaFin = apropiacion_data.get('fechaFin')
            apropiacion_formato = apropiacion_data.get('formato')
            apropiacion_medio = apropiacion_data.get('medio')
            apropiacion_nombreEntidad = apropiacion_data.get('nombreEntidad')
            apropiacion, _ = Apropiacion.objects.get_or_create(
                id=apropiacion_id,
                fechainicio=apropiacion_fechainicio,
                fechaFin=apropiacion_fechaFin,
                licencia=licencias,
                formato=apropiacion_formato,
                medio=apropiacion_medio,
                nombreEntidad=apropiacion_nombreEntidad
                )



        contenido_data = lista_producto_data.get('contenido', {})
        contenido = None
        if contenido_data:
            contenido_id = contenido_data.get('id')
            contenido_nombreEntidad = contenido_data.get('nombreEntidad')
            contenido_paginaWeb = contenido_data.get('paginaWeb')
            contenido, _ = Contenido.objects.get_or_create(
                id=contenido_id,
                nombreEntidad=contenido_nombreEntidad,
                paginaWeb=contenido_paginaWeb
            )


        pregFinalizadoyCurso_data = lista_producto_data.get('pregFinalizadoyCurso',{})
        pregFinalizadoyCurso= None
        if pregFinalizadoyCurso_data:
            pregFinalizadoyCurso_id = pregFinalizadoyCurso_data.get('id')
            pregFinalizadoyCurso_fechaInicio= pregFinalizadoyCurso_data.get('fechaInicio')
            pregFinalizadoyCurso_reconocimientos= pregFinalizadoyCurso_data.get('reconocimientos')
            pregFinalizadoyCurso_numeroPaginas= pregFinalizadoyCurso_data.get('numeroPaginas')
            pregFinalizadoyCurso, _ = PregFinalizadoyCurso.objects.get_or_create(
                id=pregFinalizadoyCurso_id,
                fechaInicio=pregFinalizadoyCurso_fechaInicio,
                reconocimientos=pregFinalizadoyCurso_reconocimientos,
                numeroPaginas=pregFinalizadoyCurso_numeroPaginas
            )      

        maestria_data = lista_producto_data.get('maestria', {})
        maestria = None
        if maestria_data:
            maestria_id = maestria_data.get('id')
            maestria_fechaInicio = maestria_data.get('fechaInicio')
            maestria_institucion = maestria_data.get('institucion')
            maestria, _ = Maestria.objects.get_or_create(
                id=maestria_id,
                fechaInicio=maestria_fechaInicio,
                institucion=maestria_institucion
            )


       # Crear o obtener el objeto ListaProducto
        lista_producto_id = lista_producto_data.get('id')
        lista_producto_proyectoCursoProducto = lista_producto_data.get('proyectoCursoProducto')
        lista_producto_proyectoFormuladoProducto = lista_producto_data.get('proyectoFormuladoProducto')
        lista_producto_proyectoRSUProducto= lista_producto_data.get('proyectoRSUProducto')
        lista_producto, _ = ListaProducto.objects.get_or_create(
            id=lista_producto_id,
            evento=evento,
            articulo=articulo,
            capitulo=capitulo,
            libro=libro,
            software=software,
            prototipoIndustrial=prototipoIndustrial,
            reconocimiento=reconocimiento,
            consultoria=consultoria,
            contenido=contenido,
            pregFinalizadoyCurso=pregFinalizadoyCurso,
            apropiacion=apropiacion,
            maestria=maestria,
            proyectoCursoProducto=lista_producto_proyectoCursoProducto,
            proyectoFormuladoProducto=lista_producto_proyectoFormuladoProducto,
            proyectoRSUProducto=lista_producto_proyectoRSUProducto
            )
        

        producto_data = {
            'id': data.get('id'),
            'tituloProducto': data.get('tituloProducto'),
            'investigador': data.get('investigador'),
            'publicacion': data.get('publicacion'),
            'estudiantes': data.get('estudiantes'),
            'estadoProdIniSemestre': data.get('estadoProdIniSemestre'),
            'porcentanjeAvanFinSemestre': data.get('porcentanjeAvanFinSemestre'),
            'observaciones': data.get('observaciones'),
            'estadoProducto': data.get('estadoProducto'),
            'porcentajeComSemestral': data.get('porcentajeComSemestral'),
            'porcentajeRealMensual': data.get('porcentajeRealMensual'),
            'fecha': data.get('fecha'),
            'origen': data.get('origen'),
        }
        producto_data['listaProducto'] = lista_producto.id

        serializer = productoSerializer(data=producto_data)
        if serializer.is_valid():
            producto = serializer.save()
            if soporte:  # Verifica si se envió un archivo
                producto.Soporte = soporte  # Asigna el archivo al campo 'Soporte'
                producto.save()  # Guarda el producto con el archivo

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class MostrarInvestigadores(APIView):
    def get(self, request, *args, **kwargs):
        investigadores = Investigador.objects.all()

        data = []
        for investigador in investigadores:
            proyectos = investigador.proyecto_set.all()
            productos = investigador.producto_set.all()
            
            proyectos_data = [{
                'codigo': proyecto.codigo,
                'fecha': proyecto.fecha,
                'titulo': proyecto.titulo,
                # otros campos del proyecto si los hay
            } for proyecto in proyectos]

            productos_data = [{
                'id': producto.id,
                'tituloProducto': producto.tituloProducto,
                # otros campos del producto si los hay
            } for producto in productos]
            
            investigador_data = {
                'nombre': investigador.nombre,
                'apellidos': investigador.apellidos,
                'numerodocumento': investigador.numerodocumento,
                'Grupoinvestigacion':investigador.grupoinvestigacion.nombre,
                'proyectos': proyectos_data,
                'productos': productos_data
                # otros campos del investigador si los hay
            }
            data.append(investigador_data)

        return JsonResponse(data, safe=False)
    

class MostrarProductos(APIView):
    def get(self, request, *args, **kwargs):
        productos = Producto.objects.all()
        data = []

        for producto in productos:
            # Información relacionada
            lista_producto = producto.listaProducto
            investigador = producto.investigador
            estudiantes = producto.estudiantes

            # Obtener información de la lista de productos
            articulo = lista_producto.articulo
            capitulo = lista_producto.capitulo
            software = lista_producto.software
            libro = lista_producto.libro
            prototipo_industrial = lista_producto.prototipoIndustrial
            evento = lista_producto.evento
            reconocimiento = lista_producto.reconocimiento
            consultoria = lista_producto.consultoria
            contenido = lista_producto.contenido
            preg_finalizado_curso = lista_producto.pregFinalizadoyCurso
            apropiacion = lista_producto.apropiacion
            maestria = lista_producto.maestria

            # Construir datos del producto y la información relacionada
            producto_data = {
                'id': producto.id,
                'titulo_producto': producto.tituloProducto,
                'publicacion': producto.publicacion,
                'estado_producto': producto.estadoProducto,
                'fecha': producto.fecha,
                #'soporte': producto.Soporte,
                'observaciones': producto.observaciones,
                'porcentanjeAvanFinSemestre': producto.porcentanjeAvanFinSemestre,
                'porcentaje_com_semestral': producto.porcentajeComSemestral,
                'porcentaje_real_mensual': producto.porcentajeRealMensual,
                'origen': producto.origen,
                'etapa': producto.etapa,
                'investigador': {
                    'nombre': investigador.nombre,
                    'apellidos': investigador.apellidos,
                    'numerodocumento': investigador.numerodocumento,
                    'Grupoinvestigacion': investigador.grupoinvestigacion.nombre,
                },
                'lista_producto': {
                    'proyectoCursoProducto': lista_producto.proyectoCursoProducto,
                    'proyectoFormuladoProducto': lista_producto.proyectoFormuladoProducto,
                    'proyectoRSUProducto': lista_producto.proyectoRSUProducto,
                    'articulo': {
                        'id': articulo.id,
                        'fuente': articulo.fuente,
                    } if articulo else None,
                    'capitulo': {
                        'id': capitulo.id,
                        'nombre_publicacion': capitulo.nombrepublicacion,
                        'isbn': capitulo.isbn,
                        'fecha': capitulo.fecha,
                        'editorial': capitulo.editorial,
                    } if capitulo else None,
                    'software': {
                        'id': software.id,
                        'tiporegistro': software.tiporegistro,
                        'numero': software.numero,
                        'fecha': software.fecha,
                        'pais': software.pais,
                    } if software else None,
                    'libro': {
                        'id': libro.id,
                        'isbn': libro.isbn,
                        'fecha': libro.fecha,
                        'editorial': libro.editorial,
                        'luegarpublicacion': libro.luegarpublicacion,
                    } if libro else None,
                    'prototipo_industrial': {
                        'id': prototipo_industrial.id,
                        'fecha': prototipo_industrial.fecha,
                        'pais': prototipo_industrial.pais,
                        'insitutofinanciador': prototipo_industrial.insitutofinanciador,
                    } if prototipo_industrial else None,
                    'evento': {
                        'id': evento.id,
                        'fechainicio': evento.fechainicio,
                        'fechafin': evento.fechafin,
                        'numparticinerno': evento.numparticinerno,
                        'numparticexterno': evento.numparticexterno,
                        'tipoevento': evento.tipoevento,
                    } if evento else None,
                    'reconocimiento': {
                        'id': reconocimiento.id,
                        'fecha': reconocimiento.fecha,
                        'nombentidadotorgada': reconocimiento.nombentidadotorgada,
                    } if reconocimiento else None,
                    'consultoria': {
                        'id': consultoria.id,
                        'ano': consultoria.año,
                        'contrato': {
                            'id': consultoria.contrato.id,
                            'nombre': consultoria.contrato.nombre,
                            'numero': consultoria.contrato.numero,
                        },
                        'nombre_entidad': consultoria.nombreEntidad,
                    } if consultoria else None,
                    'contenido': {
                        'id': contenido.id,
                        'nombre_entidad': contenido.nombreEntidad,
                        'pagina_web': contenido.paginaWeb,
                    } if contenido else None,
                    'preg_finalizado_curso': {
                        'id': preg_finalizado_curso.id,
                        'fecha_inicio': preg_finalizado_curso.fechaInicio,
                        'reconocimientos': preg_finalizado_curso.reconocimientos,
                        'numero_paginas': preg_finalizado_curso.numeroPaginas,
                    } if preg_finalizado_curso else None,
                    'apropiacion': {
                        'id': apropiacion.id,
                        'fechainicio': apropiacion.fechainicio,
                        'fecha_fin': apropiacion.fechaFin,
                        'licencia': {
                            'id': apropiacion.licencia.id,
                            'nombre': apropiacion.licencia.nombre,
                        },
                        'formato': apropiacion.formato,
                        'medio': apropiacion.medio,
                        'nombre_entidad': apropiacion.nombreEntidad,
                    } if apropiacion else None,
                    'maestria': {
                        'id': maestria.id,
                        'fecha_inicio': maestria.fechaInicio,
                        'institucion': maestria.institucion,
                    } if maestria else None,
                },
                'estudiantes': {
                    'nombres': estudiantes.nombres,
                    'apellidos': estudiantes.apellidos,
                    'semestre': estudiantes.semestre,
                    'fecha_grado': estudiantes.fechaGrado,
                    'codigo_grupo': estudiantes.codigoGrupo,
                    'tipo_documento': estudiantes.tipoDocumento,
                    'numero_documento': estudiantes.numeroDocumento,
                }
            }

            data.append(producto_data)

        return Response(data)
