function Footer() {
  return (
    <footer className="border-t text-xs text-gray-500">
      <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
        <span>© {new Date().getFullYear()} Dashboard GRO</span>
        <span>v0.1.0</span>
      </div>
    </footer>
  );
}

export default Footer;
