import math
import zlib
import struct
import os
import subprocess

def dist_point_to_segment(px, py, x1, y1, x2, y2):
    dx = x2 - x1
    dy = y2 - y1
    l2 = dx*dx + dy*dy
    if l2 == 0:
        return math.hypot(px - x1, py - y1)
    t = max(0.0, min(1.0, ((px - x1)*dx + (py - y1)*dy) / l2))
    proj_x = x1 + t * dx
    proj_y = y1 + t * dy
    return math.hypot(px - proj_x, py - proj_y)

def point_in_triangle(px, py, x1, y1, x2, y2, x3, y3):
    def sign(p1x, p1y, p2x, p2y, p3x, p3y):
        return (p1x - p3x) * (p2y - p3y) - (p2x - p3x) * (p1y - p3y)
    d1 = sign(px, py, x1, y1, x2, y2)
    d2 = sign(px, py, x2, y2, x3, y3)
    d3 = sign(px, py, x3, y3, x1, y1)
    has_neg = (d1 < 0) or (d2 < 0) or (d3 < 0)
    has_pos = (d1 > 0) or (d2 > 0) or (d3 > 0)
    return not (has_neg and has_pos)

def render_icon(size, is_maskable=False):
    # Normalized coordinate space 0..512
    scale = size / 512.0
    scale_content = 0.76 if is_maskable else 0.90
    offset = (512.0 * (1.0 - scale_content)) / 2.0

    # Transformation: 512 coords -> transformed coords
    def tf(x, y):
        return (x * scale_content + offset, y * scale_content + offset)

    # Key compass & triangle points in 512 space
    # Pivot at top
    hx, hy = tf(256, 100)
    # Hinge center
    cx, cy = tf(256, 140)
    # Left tip (needle)
    lx, ly = tf(130, 420)
    # Right tip (pencil lead)
    rx, ry = tf(382, 420)

    # Set square triangle vertices
    t1 = tf(100, 430)
    t2 = tf(412, 430)
    t3 = tf(100, 180)

    # Inner cutout of set square
    it1 = tf(140, 400)
    it2 = tf(340, 400)
    it3 = tf(140, 245)

    # Horizontal spindle bar
    sp1 = tf(185, 270)
    sp2 = tf(327, 270)
    thx, thy = tf(256, 270)

    # Arc radius and center
    arc_cx, arc_cy = cx, cy
    arc_r = math.hypot(rx - cx, ry - cy)

    pixels = []

    for y in range(size):
        row = []
        py_512 = y / scale
        for x in range(size):
            px_512 = x / scale

            # Default background: Dark CAD Slate #090d16
            r, g, b, a = 9, 13, 22, 255

            # Background squircle / rounded rect boundary for standard icon
            if not is_maskable:
                # Rounded square outer boundary (corner radius ~90)
                # Signed distance to rounded rect (pad 16px)
                dx = max(abs(px_512 - 256) - (256 - 44), 0)
                dy = max(abs(py_512 - 256) - (256 - 44), 0)
                dist_corner = math.hypot(dx, dy)
                if dist_corner > 34:
                    # Outside rounded rect
                    row.extend([0, 0, 0, 0])
                    continue
                elif dist_corner > 30:
                    # Anti-aliased outer border glow (cyan-blue)
                    edge_alpha = 1.0 - (dist_corner - 30) / 4.0
                    r = int(9 + (14 - 9) * edge_alpha)
                    g = int(13 + (165 - 13) * edge_alpha)
                    b = int(22 + (233 - 22) * edge_alpha)
                    row.extend([r, g, b, int(255 * edge_alpha)])
                    continue

            # Subtle blueprint grid lines
            grid_spacing = 32.0 * scale_content
            gx = (px_512 - offset) % grid_spacing
            gy = (py_512 - offset) % grid_spacing
            if abs(gx) < 1.0 or abs(gy) < 1.0:
                r, g, b = 18, 28, 48

            # Blueprint circular construction arc (dotted/fine)
            d_arc = abs(math.hypot(px_512 - arc_cx, py_512 - arc_cy) - arc_r)
            if d_arc < 1.8 and py_512 > cy + 80 and px_512 > lx - 30 and px_512 < rx + 30:
                arc_alpha = max(0.0, 1.0 - (d_arc / 1.8))
                r = int(r * (1 - arc_alpha) + 56 * arc_alpha)
                g = int(g * (1 - arc_alpha) + 189 * arc_alpha)
                b = int(b * (1 - arc_alpha) + 248 * arc_alpha)

            # Set-square body (Engineering Triangle behind compass)
            in_outer_tri = point_in_triangle(px_512, py_512, t1[0], t1[1], t2[0], t2[1], t3[0], t3[1])
            in_inner_tri = point_in_triangle(px_512, py_512, it1[0], it1[1], it2[0], it2[1], it3[0], it3[1])
            if in_outer_tri and not in_inner_tri:
                # Translucent blueprint cyan acrylic set-square
                tri_r, tri_g, tri_b = 2, 132, 199 # sky-600
                alpha_tri = 0.38
                r = int(r * (1 - alpha_tri) + tri_r * alpha_tri)
                g = int(g * (1 - alpha_tri) + tri_g * alpha_tri)
                b = int(b * (1 - alpha_tri) + tri_b * alpha_tri)

            # Set-square hypotenuse / outer borders (bright outline)
            d_t1_t2 = dist_point_to_segment(px_512, py_512, t1[0], t1[1], t2[0], t2[1])
            d_t2_t3 = dist_point_to_segment(px_512, py_512, t2[0], t2[1], t3[0], t3[1])
            d_t3_t1 = dist_point_to_segment(px_512, py_512, t3[0], t3[1], t1[0], t1[1])
            min_tri_border = min(d_t1_t2, d_t2_t3, d_t3_t1)
            if min_tri_border < 2.2:
                tb_alpha = max(0.0, 1.0 - (min_tri_border / 2.2)) * 0.75
                r = int(r * (1 - tb_alpha) + 56 * tb_alpha)
                g = int(g * (1 - tb_alpha) + 189 * tb_alpha)
                b = int(b * (1 - tb_alpha) + 248 * tb_alpha)

            # Horizontal Spindle / Adjustment Screw
            d_spindle = dist_point_to_segment(px_512, py_512, sp1[0], sp1[1], sp2[0], sp2[1])
            if d_spindle < 4.0:
                r, g, b = 148, 163, 184 # slate-400 steel

            # Thumbscrew knob in center of spindle
            d_thumb = math.hypot(px_512 - thx, py_512 - thy)
            if d_thumb < 11.0:
                # Knurled brass dial #f59e0b
                r, g, b = 245, 158, 11
            elif d_thumb < 13.0:
                r, g, b = 180, 83, 9

            # Left Compass Leg (Steel needle leg)
            d_leg_l = dist_point_to_segment(px_512, py_512, cx, cy, lx, ly)
            if d_leg_l < 7.5:
                # Highlight core
                if d_leg_l < 3.0:
                    r, g, b = 224, 242, 254 # sky-100 highlight
                else:
                    r, g, b = 56, 189, 248 # sky-400

            # Right Compass Leg (Graphite lead holder)
            d_leg_r = dist_point_to_segment(px_512, py_512, cx, cy, rx, ry)
            if d_leg_r < 7.5:
                if d_leg_r < 3.0:
                    r, g, b = 224, 242, 254
                else:
                    r, g, b = 14, 165, 233

            # Needle tip (sharp left point)
            d_needle = dist_point_to_segment(px_512, py_512, lx, ly, lx, ly + 25)
            if d_needle < 2.5:
                r, g, b = 203, 213, 225

            # Pencil lead chuck & lead point (right)
            d_chuck = dist_point_to_segment(px_512, py_512, rx, ry, rx, ry + 16)
            if d_chuck < 4.5:
                r, g, b = 51, 65, 85 # dark chuck
            d_lead = dist_point_to_segment(px_512, py_512, rx, ry + 16, rx, ry + 26)
            if d_lead < 2.0:
                r, g, b = 15, 23, 42 # graphite lead

            # Compass Top Handle / Grip
            d_handle = dist_point_to_segment(px_512, py_512, hx, hy - 30, hx, hy)
            if d_handle < 6.0:
                r, g, b = 148, 163, 184

            # Compass Main Circular Hinge Joint
            d_hinge = math.hypot(px_512 - cx, py_512 - cy)
            if d_hinge < 22.0:
                if d_hinge < 9.0:
                    r, g, b = 224, 242, 254 # center rivet
                elif d_hinge < 17.0:
                    r, g, b = 2, 132, 199 # sky-600 outer ring
                else:
                    r, g, b = 56, 189, 248 # cyan rim

            row.extend([r, g, b, a])
        pixels.append(row)

    # Save to PNG via zlib
    raw = bytearray()
    for row in pixels:
        raw.append(0) # filter byte none
        raw.extend(row)
    
    compressed = zlib.compress(bytes(raw), 9)
    def chunk(chunk_type, data):
        c = chunk_type + data
        crc = struct.pack('>I', zlib.crc32(c) & 0xffffffff)
        return struct.pack('>I', len(data)) + c + crc

    png = b'\x89PNG\r\n\x1a\n'
    ihdr = struct.pack('>IIBBBBB', size, size, 8, 6, 0, 0, 0)
    png += chunk(b'IHDR', ihdr)
    png += chunk(b'IDAT', compressed)
    png += chunk(b'IEND', b'')
    return png

def main():
    os.makedirs('public', exist_ok=True)
    os.makedirs('public/icons', exist_ok=True)

    print("Generating pwa-512x512.png...")
    png_512 = render_icon(512, is_maskable=False)
    with open('public/pwa-512x512.png', 'wb') as f:
        f.write(png_512)
    with open('public/icons/icon-512x512.png', 'wb') as f:
        f.write(png_512)

    print("Generating pwa-maskable-512x512.png...")
    png_maskable = render_icon(512, is_maskable=True)
    with open('public/pwa-maskable-512x512.png', 'wb') as f:
        f.write(png_maskable)
    with open('public/icons/icon-maskable-512x512.png', 'wb') as f:
        f.write(png_maskable)

    print("Generating pwa-192x192.png...")
    png_192 = render_icon(192, is_maskable=False)
    with open('public/pwa-192x192.png', 'wb') as f:
        f.write(png_192)
    with open('public/icons/icon-192x192.png', 'wb') as f:
        f.write(png_192)

    print("Generating apple-touch-icon.png (180x180)...")
    png_180 = render_icon(180, is_maskable=False)
    with open('public/apple-touch-icon.png', 'wb') as f:
        f.write(png_180)
    with open('public/icons/apple-touch-icon.png', 'wb') as f:
        f.write(png_180)

    # Convert 192 or 180 to favicon.ico using ImageMagick convert
    try:
        subprocess.run(['convert', 'public/apple-touch-icon.png', '-resize', '48x48', 'public/favicon.ico'], check=True)
        print("Generated favicon.ico successfully.")
    except Exception as e:
        print(f"Could not convert favicon with IM: {e}")

    print("All PWA PNG icons generated successfully!")

if __name__ == '__main__':
    main()
