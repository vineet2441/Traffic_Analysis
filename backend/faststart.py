import sys
import os
import struct

def faststart(in_filename, out_filename):
    with open(in_filename, 'rb') as f:
        f.seek(0, os.SEEK_END)
        file_size = f.tell()
        f.seek(0)

        atoms = []
        while f.tell() < file_size:
            pos = f.tell()
            size_data = f.read(4)
            if len(size_data) < 4:
                break
            size = struct.unpack('>I', size_data)[0]
            type_data = f.read(4)
            if size == 1:
                size = struct.unpack('>Q', f.read(8))[0]
                header_size = 16
            else:
                header_size = 8
            
            data_size = size - header_size
            atoms.append({
                'type': type_data,
                'pos': pos,
                'header_size': header_size,
                'size': size,
                'data_size': data_size
            })
            f.seek(pos + size)

        ftyp_atom = next((a for a in atoms if a['type'] == b'ftyp'), None)
        moov_atom = next((a for a in atoms if a['type'] == b'moov'), None)
        mdat_atom = next((a for a in atoms if a['type'] == b'mdat'), None)

        if not moov_atom or not mdat_atom:
            print(f"Error: Missing moov or mdat atom in {in_filename}")
            return False

        if moov_atom['pos'] < mdat_atom['pos']:
            print(f"Info: {in_filename} is already faststart (moov before mdat).")
            return True

        # Read atoms
        f.seek(ftyp_atom['pos'])
        ftyp_data = f.read(ftyp_atom['size'])

        f.seek(moov_atom['pos'])
        moov_data = bytearray(f.read(moov_atom['size']))

        # Shift stco / co64 chunk offsets in moov_data by moov_atom['size']
        moov_len = len(moov_data)

        # Update stco (32-bit chunk offsets)
        stco_idx = 0
        while True:
            stco_idx = moov_data.find(b'stco', stco_idx)
            if stco_idx == -1:
                break
            # stco layout: 4 bytes type, 4 bytes version/flags, 4 bytes count, count * 4 bytes offsets
            count = struct.unpack('>I', moov_data[stco_idx + 8 : stco_idx + 12])[0]
            offset_pos = stco_idx + 12
            for i in range(count):
                current_offset = struct.unpack('>I', moov_data[offset_pos : offset_pos + 4])[0]
                new_offset = current_offset + moov_len
                moov_data[offset_pos : offset_pos + 4] = struct.pack('>I', new_offset)
                offset_pos += 4
            stco_idx += 4

        # Update co64 (64-bit chunk offsets if present)
        co64_idx = 0
        while True:
            co64_idx = moov_data.find(b'co64', co64_idx)
            if co64_idx == -1:
                break
            count = struct.unpack('>I', moov_data[co64_idx + 8 : co64_idx + 12])[0]
            offset_pos = co64_idx + 12
            for i in range(count):
                current_offset = struct.unpack('>Q', moov_data[offset_pos : offset_pos + 8])[0]
                new_offset = current_offset + moov_len
                moov_data[offset_pos : offset_pos + 8] = struct.pack('>Q', new_offset)
                offset_pos += 8
            co64_idx += 4

        # Write faststart output file
        with open(out_filename, 'wb') as out_f:
            out_f.write(ftyp_data)
            out_f.write(moov_data)
            
            # Copy mdat data
            f.seek(mdat_atom['pos'])
            remaining = mdat_atom['size']
            while remaining > 0:
                chunk = f.read(min(remaining, 4 * 1024 * 1024))
                if not chunk:
                    break
                out_f.write(chunk)
                remaining -= len(chunk)

    print(f"Successfully converted {in_filename} -> {out_filename} to FastStart!")
    return True

if __name__ == "__main__":
    src = "annotated_junction67.mp4"
    tmp_out = "annotated_junction67_faststart.mp4"
    if faststart(src, tmp_out):
        os.replace(tmp_out, src)
        if os.path.exists("media/annotated_junction67.mp4"):
            import shutil
            shutil.copy(src, "media/annotated_junction67.mp4")
        print("FastStart applied to both root and media/ MP4 files!")
