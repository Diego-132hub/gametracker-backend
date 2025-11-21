import Juego from '../models/Juego.js';

// ✅ Obtener todos los juegos con filtros
export const getJuegos = async (req, res) => {
  try {
    const { estado, genero, plataforma, search } = req.query;
    let filtro = {};

    // Aplicar filtros si existen
    if (estado && estado !== 'todos') filtro.estado = estado;
    if (genero && genero !== 'todos') filtro.genero = genero;
    if (plataforma && plataforma !== 'todos') filtro.plataforma = plataforma;
    
    // Búsqueda por texto
    if (search) {
      filtro.$text = { $search: search };
    }

    const juegos = await Juego.find(filtro).sort({ fechaAgregado: -1 });
    
    res.json({
      success: true,
      count: juegos.length,
      data: juegos
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener los juegos',
      error: error.message
    });
  }
};

// ✅ Obtener un juego por ID
export const getJuegoById = async (req, res) => {
  try {
    const juego = await Juego.findById(req.params.id);
    
    if (!juego) {
      return res.status(404).json({
        success: false,
        message: 'Juego no encontrado'
      });
    }

    res.json({
      success: true,
      data: juego
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener el juego',
      error: error.message
    });
  }
};

// ✅ Crear nuevo juego
export const createJuego = async (req, res) => {
  try {
    const juego = new Juego(req.body);
    const nuevoJuego = await juego.save();

    res.status(201).json({
      success: true,
      message: 'Juego creado exitosamente',
      data: nuevoJuego
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error al crear el juego',
      error: error.message
    });
  }
};

// ✅ Actualizar juego
export const updateJuego = async (req, res) => {
  try {
    const juego = await Juego.findByIdAndUpdate(
      req.params.id,
      req.body,
      { 
        new: true, 
        runValidators: true 
      }
    );

    if (!juego) {
      return res.status(404).json({
        success: false,
        message: 'Juego no encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Juego actualizado exitosamente',
      data: juego
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error al actualizar el juego',
      error: error.message
    });
  }
};

// ✅ Eliminar juego
export const deleteJuego = async (req, res) => {
  try {
    const juego = await Juego.findByIdAndDelete(req.params.id);

    if (!juego) {
      return res.status(404).json({
        success: false,
        message: 'Juego no encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Juego eliminado exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al eliminar el juego',
      error: error.message
    });
  }
};

// ✅ Obtener estadísticas
export const getEstadisticas = async (req, res) => {
  try {
    const totalJuegos = await Juego.countDocuments();
    const juegosCompletados = await Juego.countDocuments({ estado: 'Completado' });
    const juegosJugando = await Juego.countDocuments({ estado: 'Jugando' });
    const totalHoras = await Juego.aggregate([
      { $group: { _id: null, totalHoras: { $sum: '$horasJugadas' } } }
    ]);
    
    // Juego más jugado
    const juegoMasJugado = await Juego.find()
      .sort({ horasJugadas: -1 })
      .limit(1);

    // Distribución por género
    const generosStats = await Juego.aggregate([
      { $group: { 
        _id: '$genero', 
        count: { $sum: 1 },
        avgPuntuacion: { $avg: '$puntuacion' }
      }},
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      data: {
        totalJuegos,
        juegosCompletados,
        juegosJugando,
        totalHoras: totalHoras[0]?.totalHoras || 0,
        juegoMasJugado: juegoMasJugado[0] || null,
        generosStats
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener estadísticas',
      error: error.message
    });
  }
};
