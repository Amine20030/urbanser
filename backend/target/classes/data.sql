-- Catégories Marrakech
INSERT INTO categories (name, icon, default_authority, authority_email, is_active) VALUES
('Transport & Trafic', '🚗', 'Voirie', 'voirie@marrakech.ma', true),
('Eau & Assainissement', '💧', 'RADEEMA', 'radeema@marrakech.ma', true),
('Collecte des Déchets', '🗑️', 'Nettoiement', 'nettoiement@marrakech.ma', true),
('Éclairage Public', '💡', 'ONEE', 'onee@marrakech.ma', true)
ON CONFLICT DO NOTHING;

-- Secteurs Marrakech
INSERT INTO sectors (name, city, center_lat, center_lng, is_active) VALUES
('Guéliz', 'Marrakech', 31.6369, -8.0154, true),
('Médina', 'Marrakech', 31.6295, -7.9811, true),
('Hivernage', 'Marrakech', 31.6186, -8.0125, true),
('Agdal', 'Marrakech', 31.6061, -7.9906, true),
('Palmeraie', 'Marrakech', 31.6726, -7.9449, true)
ON CONFLICT DO NOTHING;
