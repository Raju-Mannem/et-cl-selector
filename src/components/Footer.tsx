const Footer = () => {
  return (
    <footer className="px-16 py-4 flex justify-center items-center bg-slate-50
    border shadow-xl shadow-blue-500/10 text-blue-300 text-sm">
        <strong>&copy; Copy Rights Reserved By Campus Logics {new Date().getFullYear()}</strong>
    </footer>
  )
}

export default Footer