-- ============================================================================
-- Migración: Registro Completo de Rendimiento del Piloto y 2 Usuarios de Prueba
-- ============================================================================

-- 1. Tabla de Perfiles Extensibles de Piloto
CREATE TABLE IF NOT EXISTS perfiles_piloto (
    usuario_id UUID PRIMARY KEY REFERENCES usuarios(id) ON DELETE CASCADE,
    licencia VARCHAR(100) NOT NULL,
    nacionalidad VARCHAR(100) NOT NULL DEFAULT 'Argentina',
    codigo_pais VARCHAR(10) NOT NULL DEFAULT 'ARG',
    vehiculo_principal VARCHAR(100) NOT NULL,
    simulador_principal VARCHAR(100) NOT NULL DEFAULT 'Assetto Corsa · Shared Memory Activo',
    pace_rating INT NOT NULL DEFAULT 1500,
    safety_rating VARCHAR(5) NOT NULL DEFAULT 'B',
    nivel VARCHAR(50) NOT NULL DEFAULT 'Amateur',
    puntaje_general NUMERIC(4,1) NOT NULL DEFAULT 75.0,
    vueltas_totales INT NOT NULL DEFAULT 0,
    kilometros_totales NUMERIC(8,2) NOT NULL DEFAULT 0.0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NULL
);

-- 2. Tabla de Evaluaciones de Rendimiento y Habilidades (AI Coach & Radar 5 Ejes)
CREATE TABLE IF NOT EXISTS evaluaciones_rendimiento (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    velocidad INT NOT NULL CONSTRAINT chk_velocidad CHECK (velocidad BETWEEN 0 AND 100),
    consistencia INT NOT NULL CONSTRAINT chk_consistencia CHECK (consistencia BETWEEN 0 AND 100),
    frenada INT NOT NULL CONSTRAINT chk_frenada CHECK (frenada BETWEEN 0 AND 100),
    control INT NOT NULL CONSTRAINT chk_control CHECK (control BETWEEN 0 AND 100),
    agresividad INT NOT NULL CONSTRAINT chk_agresividad CHECK (agresividad BETWEEN 0 AND 100),
    trail_braking INT NOT NULL CONSTRAINT chk_trail_braking CHECK (trail_braking BETWEEN 0 AND 100),
    traccion_salida INT NOT NULL CONSTRAINT chk_traccion_salida CHECK (traccion_salida BETWEEN 0 AND 100),
    velocidad_apice INT NOT NULL CONSTRAINT chk_velocidad_apice CHECK (velocidad_apice BETWEEN 0 AND 100),
    respeto_limites INT NOT NULL CONSTRAINT chk_respeto_limites CHECK (respeto_limites BETWEEN 0 AND 100),
    punto_fuerte_titulo VARCHAR(150) NOT NULL,
    punto_fuerte_desc TEXT NOT NULL,
    oportunidad_mejora_titulo VARCHAR(150) NOT NULL,
    oportunidad_mejora_desc TEXT NOT NULL,
    consejo_frenada TEXT NOT NULL,
    consejo_traccion TEXT NOT NULL,
    consejo_apice TEXT NOT NULL,
    consejo_consistencia TEXT NOT NULL,
    consejo_limites TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 3. Tabla de Catálogo de Logros e Insignias
CREATE TABLE IF NOT EXISTS logros (
    id VARCHAR(50) PRIMARY KEY,
    titulo VARCHAR(100) NOT NULL,
    descripcion VARCHAR(250) NOT NULL,
    icono VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 4. Tabla de Logros Desbloqueados por Usuario
CREATE TABLE IF NOT EXISTS usuarios_logros (
    usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    logro_id VARCHAR(50) NOT NULL REFERENCES logros(id) ON DELETE CASCADE,
    desbloqueado_en TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    PRIMARY KEY (usuario_id, logro_id)
);

-- Índices de consulta rápida
CREATE INDEX IF NOT EXISTS idx_perfiles_piloto_rating ON perfiles_piloto (pace_rating DESC);
CREATE INDEX IF NOT EXISTS idx_evaluaciones_usuario ON evaluaciones_rendimiento (usuario_id);

-- Semilla de Logros Oficiales
INSERT INTO logros (id, titulo, descripcion, icono) VALUES
    ('monza-sub-82', 'Muro de la Velocidad', 'Vuelta por debajo de 01:22.000 en el Autodromo Nazionale Monza', 'zap'),
    ('telemetria-pro', 'Ingeniero en Cabina', 'Completaste 50 vueltas con telemetría en tiempo real a 60 Hz', 'gauge'),
    ('fappe-showcase', 'Piloto Oficial ApexLink', 'Conducción en pista con telemetría de boxes activa', 'award'),
    ('freno-precision', 'Freno de Precisión', 'Trail braking óptimo en la Variante del Rettifilo.', 'disc'),
    ('ritmo-quirurgico', 'Ritmo Quirúrgico', '10 vueltas seguidas dentro de un delta de ±0.2 s.', 'crosshair'),
    ('sub-121-monza', 'Sub 1:21 Monza', 'Vuelta rápida en configuración F1 / GT3.', 'timer'),
    ('cero-incidentes', 'Cero Incidentes', '100% de vueltas válidas sin exceder los límites de pista.', 'shield-check')
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- Semilla de los 2 Usuarios de Prueba con Datos Totalmente Diferenciados
-- ============================================================================

DO $$
DECLARE
    v_id_garlati UUID := '11111111-1111-1111-1111-111111111111';
    v_id_salas   UUID := '22222222-2222-2222-2222-222222222222';
    v_rol_piloto_id UUID;
    v_rol_ingeniero_id UUID;
    v_sesion_garlati_monza UUID := '33333333-3333-3333-3333-333333333331';
    v_sesion_garlati_rbr   UUID := '33333333-3333-3333-3333-333333333332';
    v_sesion_salas_monza   UUID := '44444444-4444-4444-4444-444444444441';
    v_sesion_salas_spa     UUID := '44444444-4444-4444-4444-444444444442';
BEGIN
    SELECT id INTO v_rol_piloto_id FROM roles WHERE nombre = 'Piloto';
    SELECT id INTO v_rol_ingeniero_id FROM roles WHERE nombre = 'Ingeniero de Pista';

    -- ------------------------------------------------------------------------
    -- USUARIO 1: ALEJO GARLATI (Alien F1 • Setup Specialist)
    -- ------------------------------------------------------------------------
    INSERT INTO usuarios (id, nombre_completo, alias_piloto, email, password_hash, activo)
    VALUES (
        v_id_garlati,
        'Alejo Garlati',
        'AG_PRO',
        'agarlati@apexlink.io',
        '$2a$11$eAKo2.g5Yk5Qk8QeW7Xz6.V.mG5r6tY8u9i0o1p2q3r4s5t6u7v8w',
        TRUE
    )
    ON CONFLICT (email) DO UPDATE SET
        nombre_completo = EXCLUDED.nombre_completo,
        alias_piloto = EXCLUDED.alias_piloto;

    IF v_rol_piloto_id IS NOT NULL THEN
        INSERT INTO usuarios_roles (usuario_id, rol_id) VALUES (v_id_garlati, v_rol_piloto_id) ON CONFLICT DO NOTHING;
    END IF;
    IF v_rol_ingeniero_id IS NOT NULL THEN
        INSERT INTO usuarios_roles (usuario_id, rol_id) VALUES (v_id_garlati, v_rol_ingeniero_id) ON CONFLICT DO NOTHING;
    END IF;

    -- Perfil de Alejo Garlati
    INSERT INTO perfiles_piloto (
        usuario_id, licencia, nacionalidad, codigo_pais, vehiculo_principal, simulador_principal,
        pace_rating, safety_rating, nivel, puntaje_general, vueltas_totales, kilometros_totales
    ) VALUES (
        v_id_garlati, 'Licencia Apex F1 Alien', 'Argentina', 'ARG', 'Ferrari SF70H (F1)',
        'Assetto Corsa · Shared Memory Win32 MMF', 2850, 'S', 'Alien F1', 96.5, 34, 196.4
    )
    ON CONFLICT (usuario_id) DO UPDATE SET
        licencia = EXCLUDED.licencia,
        pace_rating = EXCLUDED.pace_rating,
        safety_rating = EXCLUDED.safety_rating,
        nivel = EXCLUDED.nivel,
        puntaje_general = EXCLUDED.puntaje_general,
        vueltas_totales = EXCLUDED.vueltas_totales,
        kilometros_totales = EXCLUDED.kilometros_totales;

    -- Evaluación y Habilidades de Alejo Garlati
    DELETE FROM evaluaciones_rendimiento WHERE usuario_id = v_id_garlati;
    INSERT INTO evaluaciones_rendimiento (
        usuario_id, velocidad, consistencia, frenada, control, agresividad,
        trail_braking, traccion_salida, velocidad_apice, respeto_limites,
        punto_fuerte_titulo, punto_fuerte_desc,
        oportunidad_mejora_titulo, oportunidad_mejora_desc,
        consejo_frenada, consejo_traccion, consejo_apice, consejo_consistencia, consejo_limites
    ) VALUES (
        v_id_garlati, 98, 97, 96, 95, 89,
        96, 94, 98, 92,
        'Punto Fuerte: Variante Ascari & Curva Grande',
        'Paso por curva con carga aerodinámica máxima impecable. +7.2 km/h por encima del promedio del stint sin pérdida de adherencia lateral.',
        'Oportunidad de Mejora: Entrada a Variante del Rettifilo',
        'Frenada en los 120 metros con deceleración extrema de -3.2G. Liberar un 10% antes para evitar bloqueo microscópico en rueda delantera interior.',
        'Excelente modulación progresiva. Podés mantener el umbral de 100% de presión 5 metros más profundo antes del bite point.',
        'Excelente tracción y dosificación en marchas cortas. El despliegue de ERS híbrido en salida de curva es perfecto.',
        'Punto más fuerte de tu conducción. Mantienes una velocidad de vértice superior explotando al máximo el fondo plano.',
        'Ritmo con dispersión menor a ±0.080 s por vuelta. Estabilidad digna de clasificación de monoplazas.',
        'Respeto milimétrico de las líneas blancas y pianos en Monza y Red Bull Ring.'
    );

    -- Logros de Alejo Garlati
    INSERT INTO usuarios_logros (usuario_id, logro_id) VALUES
        (v_id_garlati, 'monza-sub-82'),
        (v_id_garlati, 'telemetria-pro'),
        (v_id_garlati, 'fappe-showcase'),
        (v_id_garlati, 'ritmo-quirurgico'),
        (v_id_garlati, 'sub-121-monza')
    ON CONFLICT DO NOTHING;

    -- Sesiones de Alejo Garlati
    INSERT INTO sesiones (id, usuario_id, circuito, configuracion_circuito, modelo_vehiculo, tipo_sesion, es_simulacion_mock, fecha_inicio, fecha_fin, total_vueltas, mejor_tiempo_ms)
    VALUES
        (v_sesion_garlati_monza, v_id_garlati, 'Autodromo Nazionale Monza', 'Grand Prix (5.793 m)', 'Ferrari SF70H (F1)', 1, FALSE, '2026-10-31 19:15:00+00', '2026-10-31 20:00:00+00', 18, 81240),
        (v_sesion_garlati_rbr, v_id_garlati, 'Red Bull Ring (Spielberg)', 'Grand Prix (4.318 m)', 'Ferrari SF70H (F1)', 1, FALSE, '2026-10-28 17:30:00+00', '2026-10-28 18:15:00+00', 16, 65410)
    ON CONFLICT (id) DO UPDATE SET
        total_vueltas = EXCLUDED.total_vueltas,
        mejor_tiempo_ms = EXCLUDED.mejor_tiempo_ms;

    -- Vueltas representativas de Garlati
    INSERT INTO vueltas (id, sesion_id, numero_vuelta, tiempo_vuelta_ms, tiempo_vuelta_formateado, sector_1_ms, sector_2_ms, sector_3_ms, es_valida, es_mejor_vuelta)
    VALUES
        ('33333333-3333-3333-3333-000000000001', v_sesion_garlati_monza, 1, 83450, '01:23.450', 28910, 28140, 26400, TRUE, FALSE),
        ('33333333-3333-3333-3333-000000000002', v_sesion_garlati_monza, 2, 82110, '01:22.110', 28350, 27690, 26070, TRUE, FALSE),
        ('33333333-3333-3333-3333-000000000003', v_sesion_garlati_monza, 3, 81240, '01:21.240', 28010, 27420, 25810, TRUE, TRUE)
    ON CONFLICT (id) DO NOTHING;

    -- ------------------------------------------------------------------------
    -- USUARIO 2: ALEJO SALAS (Pro-Am GT3 • Endurance Specialist)
    -- ------------------------------------------------------------------------
    INSERT INTO usuarios (id, nombre_completo, alias_piloto, email, password_hash, activo)
    VALUES (
        v_id_salas,
        'Alejo Salas',
        'AS_GT3',
        'asalas@apexlink.io',
        '$2a$11$eAKo2.g5Yk5Qk8QeW7Xz6.V.mG5r6tY8u9i0o1p2q3r4s5t6u7v8w',
        TRUE
    )
    ON CONFLICT (email) DO UPDATE SET
        nombre_completo = EXCLUDED.nombre_completo,
        alias_piloto = EXCLUDED.alias_piloto;

    IF v_rol_piloto_id IS NOT NULL THEN
        INSERT INTO usuarios_roles (usuario_id, rol_id) VALUES (v_id_salas, v_rol_piloto_id) ON CONFLICT DO NOTHING;
    END IF;

    -- Perfil de Alejo Salas
    INSERT INTO perfiles_piloto (
        usuario_id, licencia, nacionalidad, codigo_pais, vehiculo_principal, simulador_principal,
        pace_rating, safety_rating, nivel, puntaje_general, vueltas_totales, kilometros_totales
    ) VALUES (
        v_id_salas, 'Licencia Apex GT3 Pro-Am', 'Argentina', 'ARG', 'Ferrari 488 GT3',
        'Assetto Corsa · Shared Memory Win32 MMF', 1950, 'A', 'Pro-Am GT3', 78.5, 20, 130.4
    )
    ON CONFLICT (usuario_id) DO UPDATE SET
        licencia = EXCLUDED.licencia,
        pace_rating = EXCLUDED.pace_rating,
        safety_rating = EXCLUDED.safety_rating,
        nivel = EXCLUDED.nivel,
        puntaje_general = EXCLUDED.puntaje_general,
        vueltas_totales = EXCLUDED.vueltas_totales,
        kilometros_totales = EXCLUDED.kilometros_totales;

    -- Evaluación y Habilidades de Alejo Salas
    DELETE FROM evaluaciones_rendimiento WHERE usuario_id = v_id_salas;
    INSERT INTO evaluaciones_rendimiento (
        usuario_id, velocidad, consistencia, frenada, control, agresividad,
        trail_braking, traccion_salida, velocidad_apice, respeto_limites,
        punto_fuerte_titulo, punto_fuerte_desc,
        oportunidad_mejora_titulo, oportunidad_mejora_desc,
        consejo_frenada, consejo_traccion, consejo_apice, consejo_consistencia, consejo_limites
    ) VALUES (
        v_id_salas, 81, 86, 79, 83, 75,
        79, 91, 74, 88,
        'Punto Fuerte: Tracción en Salida de Curva',
        'Apertura progresiva y limpia del acelerador al salir de curvas de media velocidad. Cero patinaje y excelente cuidado del compuesto trasero.',
        'Oportunidad de Mejora: Transición de Freno a Ápice (Trail-Braking)',
        'Liberación del pedal de freno algo abrupta en los últimos 25 metros antes del vértice, provocando subviraje transitorio en la entrada.',
        'Soltá el freno de forma más lineal en los últimos 30 m antes del ápice en lugar de soltar en escalón.',
        'Es tu mayor fortaleza en GT3. Podés intentar anticipar 2 metros la aceleración en chicanas lentas.',
        'Llevás demasiada velocidad sobrante al frenar y la perdés en el ápice. Frená 5 metros antes para asegurar mayor rotación.',
        'Ritmo repetible y predecible. Muy apto para stints de larga duración en carreras de resistencia GT.',
        'Buen respeto de pianos. Cuidado con el piano exterior de la Variante Ascari al acelerar a fondo.'
    );

    -- Logros de Alejo Salas
    INSERT INTO usuarios_logros (usuario_id, logro_id) VALUES
        (v_id_salas, 'freno-precision'),
        (v_id_salas, 'cero-incidentes'),
        (v_id_salas, 'fappe-showcase')
    ON CONFLICT DO NOTHING;

    -- Sesiones de Alejo Salas
    INSERT INTO sesiones (id, usuario_id, circuito, configuracion_circuito, modelo_vehiculo, tipo_sesion, es_simulacion_mock, fecha_inicio, fecha_fin, total_vueltas, mejor_tiempo_ms)
    VALUES
        (v_sesion_salas_monza, v_id_salas, 'Autodromo Nazionale Monza', 'Grand Prix (5.793 m)', 'Ferrari 488 GT3', 0, FALSE, '2026-10-29 16:40:00+00', '2026-10-29 17:15:00+00', 8, 107382),
        (v_sesion_salas_spa, v_id_salas, 'Circuit de Spa-Francorchamps', 'Grand Prix (7.004 m)', 'Ferrari 488 GT3', 0, FALSE, '2026-10-26 18:20:00+00', '2026-10-26 19:10:00+00', 12, 138420)
    ON CONFLICT (id) DO UPDATE SET
        total_vueltas = EXCLUDED.total_vueltas,
        mejor_tiempo_ms = EXCLUDED.mejor_tiempo_ms;

    -- Vueltas representativas de Salas
    INSERT INTO vueltas (id, sesion_id, numero_vuelta, tiempo_vuelta_ms, tiempo_vuelta_formateado, sector_1_ms, sector_2_ms, sector_3_ms, es_valida, es_mejor_vuelta)
    VALUES
        ('44444444-4444-4444-4444-000000000001', v_sesion_salas_monza, 1, 109210, '01:49.210', 37450, 36810, 34950, TRUE, FALSE),
        ('44444444-4444-4444-4444-000000000002', v_sesion_salas_monza, 2, 108150, '01:48.150', 37120, 36410, 34620, TRUE, FALSE),
        ('44444444-4444-4444-4444-000000000003', v_sesion_salas_monza, 3, 107382, '01:47.382', 36820, 36190, 34372, TRUE, TRUE)
    ON CONFLICT (id) DO NOTHING;

END $$;
