import { Link } from "react-router-dom";
function Header({ isAdminAuthenticated, onLogout, siteSettings }) {
  const today = new Intl.DateTimeFormat("es-MX", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(new Date());
  const settings = { topMeta: "Edición digital escolar", kicker: "Comunidad • Escuela • Cultura • Actualidad", title: "El Faro Escolar", subtitle: "Un periódico escolar digital con mirada local, nacional e internacional", ...siteSettings };
  return (<header className="site-header"><div className="top-strip top-strip-extended"><div className="top-strip-meta"><span>{settings.topMeta}</span><span>{today}</span></div><div className="top-strip-actions"><Link to={isAdminAuthenticated ? "/admin" : "/admin/login"} className="admin-access-link">{isAdminAuthenticated ? "Panel editor" : "Acceso editor"}</Link>{isAdminAuthenticated ? <button type="button" className="logout-button" onClick={onLogout}>Cerrar sesión</button> : null}</div></div><div className="masthead"><p className="masthead-kicker">{settings.kicker}</p><h1>{settings.title}</h1><p className="masthead-subtitle">{settings.subtitle}</p></div></header>);
}
export default Header;