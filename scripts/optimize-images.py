#!/usr/bin/env python
import argparse
import pathlib
import sys

try:
    from PIL import Image
except ImportError:  # pragma: no cover
    print("Pillow is required. Install with: pip install pillow")
    sys.exit(1)


SUPPORTED_EXTS = {".jpg", ".jpeg", ".png"}


def iter_images(root: pathlib.Path):
    for path in root.rglob("*"):
        if path.is_file() and path.suffix.lower() in SUPPORTED_EXTS:
            yield path


def optimize_image(src: pathlib.Path, dest: pathlib.Path, quality: int, to_webp: bool):
    dest.parent.mkdir(parents=True, exist_ok=True)
    with Image.open(src) as im:
        if to_webp:
            out_path = dest.with_suffix(".webp")
            im.save(out_path, format="WEBP", quality=quality, method=6)
        else:
            out_path = dest
            save_kwargs = {"quality": quality, "optimize": True}
            if src.suffix.lower() in {".jpg", ".jpeg"}:
                save_kwargs["progressive"] = True
            im.save(out_path, **save_kwargs)
    return out_path


def main():
    parser = argparse.ArgumentParser(
        description="Optimize images with Pillow. Defaults to safe output directory."
    )
    parser.add_argument(
        "root",
        nargs="?",
        default=".",
        help="Root directory to scan for images (default: current directory).",
    )
    parser.add_argument(
        "--out",
        default="optimized",
        help="Output directory for optimized files (default: optimized).",
    )
    parser.add_argument(
        "--quality",
        type=int,
        default=82,
        help="Quality setting (1-95). Default: 82.",
    )
    parser.add_argument(
        "--webp",
        action="store_true",
        help="Write WebP copies instead of JPEG/PNG re-encodes.",
    )
    parser.add_argument(
        "--in-place",
        action="store_true",
        help="Overwrite original files (use with care).",
    )

    args = parser.parse_args()
    root = pathlib.Path(args.root).resolve()

    if not root.exists():
        print(f"Root directory not found: {root}")
        return 2

    if args.in_place and args.out != "optimized":
        print("Cannot use --in-place with --out. Choose one.")
        return 2

    out_dir = root if args.in_place else (root / args.out)

    count = 0
    for src in iter_images(root):
        # Avoid re-optimizing output directory contents.
        if not args.in_place and out_dir in src.parents:
            continue

        rel = src.relative_to(root)
        dest = out_dir / rel
        out_path = optimize_image(src, dest, args.quality, args.webp)
        print(f"{src} -> {out_path}")
        count += 1

    print(f"Done. Optimized {count} file(s).")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
