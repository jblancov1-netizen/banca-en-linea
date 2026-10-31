import React, { useState, useEffect } from 'react';
import { 
  Building2, UserCheck, ShieldCheck, CreditCard, Users, ArrowUpRight, ArrowDownLeft, 
  Repeat, Lock, Unlock, LogOut, CheckCircle, AlertCircle, PlusCircle, UserPlus, 
  TrendingUp, Activity, DollarSign, FileText, ChevronRight, Menu, X, ShieldAlert, PieChart
} from 'lucide-react';

// --- INITIAL MOCK DATA FOR LOCAL STORAGE ---
const initialData = {
  // Cuentas creadas por cajeros
  accounts: [
    { id: '1001', name: 'Juan Pérez', dpi: '1234567890101', balance: 5000, createdAt: new Date().toISOString().split('T')[0] },
    { id: '1002', name: 'María López', dpi: '9876543210101', balance: 12500, createdAt: new Date().toISOString().split('T')[0] },
    { id: '1003', name: 'Carlos Gómez', dpi: '5554443330101', balance: 800, createdAt: new Date().toISOString().split('T')[0] }
  ],
  // Usuarios registrados por los clientes
  users: [
    { email: 'juan@gmail.com', dpi: '1234567890101', accountNo: '1001', pass: 'user123', registeredAt: new Date().toISOString().split('T')[0] },
    { email: 'maria@gmail.com', dpi: '9876543210101', accountNo: '1002', pass: 'user123', registeredAt: new Date().toISOString().split('T')[0] }
  ],
  // Cajeros del sistema
  cajeros: [
    { id: 'c1', name: 'Pedro Cajero', username: 'cajero1', pass: 'cajero123', blocked: false },
    { id: 'c2', name: 'Ana Cajera', username: 'cajero2', pass: 'cajero123', blocked: false }
  ],
  // Cuentas de terceros agregadas por cada usuario (key: accountNo del dueño)
  thirdPartyAccounts: {
    '1001': [
      { accountNo: '1002', alias: 'María López (Ahorros)', maxAmount: 3000, maxDailyTx: 5 }
    ]
  },
  // Transacciones globales
  transactions: [
    { id: 'tx-1', date: new Date().toISOString().split('T')[0], type: 'DEPOSITO', accountNo: '1001', amount: 5000, description: 'Depósito inicial en ventanilla' },
    { id: 'tx-2', date: new Date().toISOString().split('T')[0], type: 'DEPOSITO', accountNo: '1002', amount: 12500, description: 'Depósito inicial en ventanilla' },
    { id: 'tx-3', date: new Date().toISOString().split('T')[0], type: 'DEPOSITO', accountNo: '1003', amount: 800, description: 'Depósito inicial en ventanilla' },
  ]
};

export default function App() {
  // State initialization with LocalStorage
  const [db, setDb] = useState(() => {
    const saved = localStorage.getItem('banca_linea_db');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return initialData; }
    }
    return initialData;
  });

  const [currentRole, setCurrentRole] = useState('guest'); // 'guest', 'admin', 'cajero', 'user'
  const [currentUser, setCurrentUser] = useState(null); // Object of logged in user
  const [activeTab, setActiveTab] = useState('login'); // active view tab
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toast, setToast] = useState(null);

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('banca_linea_db', JSON.stringify(db));
  }, [db]);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleLogout = () => {
    setCurrentRole('guest');
    setCurrentUser(null);
    setActiveTab('login-user');
    showToast('Sesión cerrada correctamente', 'info');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-xl border flex items-center gap-3 transition-all transform translate-y-0 ${
          toast.type === 'error' ? 'bg-red-900 border-red-700 text-red-100' :
          toast.type === 'success' ? 'bg-emerald-900 border-emerald-700 text-emerald-100' :
          'bg-slate-900 border-slate-700 text-slate-100'
        }`}>
          {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-red-400" />}
          {toast.type === 'success' && <CheckCircle className="w-5 h-5 text-emerald-400" />}
          {toast.type === 'info' && <AlertCircle className="w-5 h-5 text-blue-400" />}
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
      )}

      {/* Main Navigation Bar */}
      <header className="bg-slate-900 text-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => { if(currentRole === 'guest') setActiveTab('login'); }}>
            <div className="bg-emerald-500 p-2 rounded-lg text-slate-950 font-bold">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-extrabold text-lg tracking-tight text-white leading-none">BANCO NEXUS</h1>
              <p className="text-xs text-emerald-400 font-medium">Banca en Línea Segura</p>
            </div>
          </div>

          {/* Desktop Navigation Links (Guest mode) */}
          {currentRole === 'guest' && (
            <div className="hidden md:flex items-center space-x-1 lg:space-x-2 text-sm font-medium">
              <button 
                onClick={() => setActiveTab('login-admin')}
                className={`px-3 py-2 rounded-md transition ${activeTab === 'login-admin' ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:text-white hover:bg-slate-800'}`}
              >
                Login Admin
              </button>
              <button 
                onClick={() => setActiveTab('login-cajero')}
                className={`px-3 py-2 rounded-md transition ${activeTab === 'login-cajero' ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:text-white hover:bg-slate-800'}`}
              >
                Login Cajero
              </button>
              <button 
                onClick={() => setActiveTab('login-user')}
                className={`px-3 py-2 rounded-md transition ${activeTab === 'login-user' ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:text-white hover:bg-slate-800'}`}
              >
                Login Cliente
              </button>
              <button 
                onClick={() => setActiveTab('register-user')}
                className={`px-3 py-2 rounded-md bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold transition`}
              >
                Crear Usuario
              </button>
            </div>
          )}

          {/* Logged-in Header Profile Info */}
          {currentRole !== 'guest' && (
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider">{currentRole}</span>
                <span className="text-sm font-semibold text-slate-200">
                  {currentRole === 'admin' && 'Administrador Sistema'}
                  {currentRole === 'cajero' && currentUser?.name}
                  {currentRole === 'user' && currentUser?.email}
                </span>
              </div>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 bg-slate-800 hover:bg-red-950 hover:text-red-300 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-700 text-sm transition"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Salir</span>
              </button>
            </div>
          )}

          {/* Mobile menu trigger button */}
          {currentRole === 'guest' && (
            <div className="md:hidden">
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-slate-300 hover:text-white p-2"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          )}
        </div>

        {/* Mobile Dropdown Menu */}
        {currentRole === 'guest' && mobileMenuOpen && (
          <div className="md:hidden bg-slate-950 px-4 pt-2 pb-4 space-y-2 border-b border-slate-800">
            <button 
              onClick={() => { setActiveTab('login-admin'); setMobileMenuOpen(false); }}
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              Login Administrador
            </button>
            <button 
              onClick={() => { setActiveTab('login-cajero'); setMobileMenuOpen(false); }}
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              Login Cajero
            </button>
            <button 
              onClick={() => { setActiveTab('login-user'); setMobileMenuOpen(false); }}
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              Login Cliente
            </button>
            <button 
              onClick={() => { setActiveTab('register-user'); setMobileMenuOpen(false); }}
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium bg-emerald-500 text-slate-950 font-bold"
            >
              Registro de Nuevo Usuario
            </button>
          </div>
        )}
      </header>

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">

        {/* ------------------------------------------------------------- */}
        {/* 1. PAGINA PRINCIPAL Y LOGINS DE INICIO                          */}
        {/* ------------------------------------------------------------- */}
        {currentRole === 'guest' && (
          <div className="py-4">
            {/* Quick Cards Landing Selector */}
            {(activeTab === 'login' || !activeTab) && (
              <div className="space-y-8">
                <div className="text-center max-w-3xl mx-auto space-y-3">
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                    Plataforma Integral de Banca Digital
                  </h2>
                  <p className="text-slate-600 text-base sm:text-lg">
                    Acceda a su portal correspondiente o registre su cuenta bancaria para operar en línea de forma ágil y segura.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
                  <div 
                    onClick={() => setActiveTab('login-admin')} 
                    className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-lg hover:border-emerald-500 transition cursor-pointer flex flex-col justify-between group"
                  >
                    <div>
                      <div className="w-12 h-12 bg-indigo-100 text-indigo-700 rounded-lg flex items-center justify-center mb-4 group-hover:bg-indigo-600 group-hover:text-white transition">
                        <ShieldCheck className="w-6 h-6" />
                      </div>
                      <h3 className="font-bold text-lg text-slate-900">Portal Administrador</h3>
                      <p className="text-sm text-slate-500 mt-2">Gestión de cajeros del sistema y monitor global de transacciones monetarias.</p>
                    </div>
                    <div className="mt-6 flex items-center text-xs font-bold text-indigo-600 uppercase tracking-wider group-hover:text-indigo-800">
                      Ingresar como Admin <ChevronRight className="w-4 h-4 ml-1" />
                    </div>
                  </div>

                  <div 
                    onClick={() => setActiveTab('login-cajero')} 
                    className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-lg hover:border-emerald-500 transition cursor-pointer flex flex-col justify-between group"
                  >
                    <div>
                      <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-lg flex items-center justify-center mb-4 group-hover:bg-amber-600 group-hover:text-white transition">
                        <Building2 className="w-6 h-6" />
                      </div>
                      <h3 className="font-bold text-lg text-slate-900">Portal Cajero</h3>
                      <p className="text-sm text-slate-500 mt-2">Creación de cuentas de clientes, realización de depósitos y débitos en ventanilla.</p>
                    </div>
                    <div className="mt-6 flex items-center text-xs font-bold text-amber-600 uppercase tracking-wider group-hover:text-amber-800">
                      Ingresar como Cajero <ChevronRight className="w-4 h-4 ml-1" />
                    </div>
                  </div>

                  <div 
                    onClick={() => setActiveTab('login-user')} 
                    className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-lg hover:border-emerald-500 transition cursor-pointer flex flex-col justify-between group"
                  >
                    <div>
                      <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-lg flex items-center justify-center mb-4 group-hover:bg-emerald-600 group-hover:text-white transition">
                        <UserCheck className="w-6 h-6" />
                      </div>
                      <h3 className="font-bold text-lg text-slate-900">Portal Cliente</h3>
                      <p className="text-sm text-slate-500 mt-2">Consulte estados de cuenta, administre terceros y realice transferencias en tiempo real.</p>
                    </div>
                    <div className="mt-6 flex items-center text-xs font-bold text-emerald-600 uppercase tracking-wider group-hover:text-emerald-800">
                      Ingresar como Cliente <ChevronRight className="w-4 h-4 ml-1" />
                    </div>
                  </div>

                  <div 
                    onClick={() => setActiveTab('register-user')} 
                    className="bg-slate-900 text-white rounded-xl p-6 shadow-sm border border-slate-800 hover:bg-slate-800 transition cursor-pointer flex flex-col justify-between group"
                  >
                    <div>
                      <div className="w-12 h-12 bg-emerald-500 text-slate-950 rounded-lg flex items-center justify-center mb-4 font-bold">
                        <UserPlus className="w-6 h-6" />
                      </div>
                      <h3 className="font-bold text-lg text-white">Registro de Cliente</h3>
                      <p className="text-sm text-slate-300 mt-2">¿Ya abrió su cuenta en el banco? Active su banca en línea llenando el registro.</p>
                    </div>
                    <div className="mt-6 flex items-center text-xs font-bold text-emerald-400 uppercase tracking-wider">
                      Registrarse Ahora <ChevronRight className="w-4 h-4 ml-1" />
                    </div>
                  </div>
                </div>

                {/* Quick Demo Credentials Info Box */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mt-8 max-w-4xl mx-auto text-blue-900 text-sm">
                  <h4 className="font-bold flex items-center gap-2 text-base text-blue-950 mb-2">
                    <ShieldCheck className="w-5 h-5 text-blue-600" /> Credenciales de Demostración para Evaluación Rapida:
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                    <div className="bg-white p-3 rounded border border-blue-100">
                      <p className="font-bold text-xs uppercase text-slate-500">Administrador</p>
                      <p className="mt-1"><strong>Usuario:</strong> admin</p>
                      <p><strong>Contraseña:</strong> admin123</p>
                    </div>
                    <div className="bg-white p-3 rounded border border-blue-100">
                      <p className="font-bold text-xs uppercase text-slate-500">Cajero Ventanilla</p>
                      <p className="mt-1"><strong>Usuario:</strong> cajero1</p>
                      <p><strong>Contraseña:</strong> cajero123</p>
                    </div>
                    <div className="bg-white p-3 rounded border border-blue-100">
                      <p className="font-bold text-xs uppercase text-slate-500">Cliente Registrado</p>
                      <p className="mt-1"><strong>Correo:</strong> juan@gmail.com</p>
                      <p><strong>Contraseña:</strong> user123</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Login Admin Screen */}
            {activeTab === 'login-admin' && (
              <AdminLoginForm 
                onLoginSuccess={(user) => {
                  setCurrentRole('admin');
                  setCurrentUser(user);
                  setActiveTab('admin-monitor');
                  showToast('Bienvenido Administrador', 'success');
                }} 
                showToast={showToast}
                onCancel={() => setActiveTab('login')}
              />
            )}

            {/* Login Cajero Screen */}
            {activeTab === 'login-cajero' && (
              <CajeroLoginForm 
                cajeros={db.cajeros}
                onLoginSuccess={(cajero) => {
                  setCurrentRole('cajero');
                  setCurrentUser(cajero);
                  setActiveTab('cajero-create-account');
                  showToast(`Bienvenido Cajero: ${cajero.name}`, 'success');
                }} 
                showToast={showToast}
                onCancel={() => setActiveTab('login')}
              />
            )}

            {/* Login User Screen */}
            {activeTab === 'login-user' && (
              <UserLoginForm 
                users={db.users}
                onLoginSuccess={(user) => {
                  setCurrentRole('user');
                  setCurrentUser(user);
                  setActiveTab('user-statement');
                  showToast(`Bienvenido de nuevo, ${user.email}`, 'success');
                }} 
                showToast={showToast}
                onCancel={() => setActiveTab('login')}
              />
            )}

            {/* Register User Screen */}
            {activeTab === 'register-user' && (
              <RegisterUserForm 
                db={db}
                onRegisterSuccess={(newUser) => {
                  setDb(prev => ({ ...prev, users: [...prev.users, newUser] }));
                  showToast('Usuario registrado exitosamente. Ahora puede iniciar sesión.', 'success');
                  setActiveTab('login-user');
                }}
                showToast={showToast}
                onCancel={() => setActiveTab('login')}
              />
            )}
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* 2. PANEL DE ADMINISTRADOR                                     */}
        {/* ------------------------------------------------------------- */}
        {currentRole === 'admin' && (
          <div className="space-y-6">
            {/* Admin Header Submenu */}
            <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-200 flex flex-wrap gap-2">
              <button 
                onClick={() => setActiveTab('admin-cajeros')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition ${
                  activeTab === 'admin-cajeros' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Users className="w-4 h-4" /> Gestión de Cajeros
              </button>
              <button 
                onClick={() => setActiveTab('admin-monitor')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition ${
                  activeTab === 'admin-monitor' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Activity className="w-4 h-4" /> Monitor de Transferencias
              </button>
            </div>

            {/* Admin Tab: Gestión de Cajeros */}
            {activeTab === 'admin-cajeros' && (
              <AdminCajerosManager 
                cajeros={db.cajeros} 
                onToggleBlock={(cajeroId) => {
                  setDb(prev => ({
                    ...prev,
                    cajeros: prev.cajeros.map(c => c.id === cajeroId ? { ...c, blocked: !c.blocked } : c)
                  }));
                  showToast('Estado del cajero actualizado', 'info');
                }}
                onAddCajero={(newCajero) => {
                  setDb(prev => ({ ...prev, cajeros: [...prev.cajeros, newCajero] }));
                  showToast('Cajero registrado exitosamente', 'success');
                }}
                showToast={showToast}
              />
            )}

            {/* Admin Tab: Monitor de Transferencias */}
            {activeTab === 'admin-monitor' && (
              <AdminMonitor db={db} />
            )}
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* 3. PANEL DE CAJERO                                            */}
        {/* ------------------------------------------------------------- */}
        {currentRole === 'cajero' && (
          <div className="space-y-6">
            {/* Cajero Header Submenu */}
            <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-200 flex flex-wrap gap-2">
              <button 
                onClick={() => setActiveTab('cajero-create-account')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition ${
                  activeTab === 'cajero-create-account' ? 'bg-amber-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <UserPlus className="w-4 h-4" /> Crear Cuenta Monetaria
              </button>
              <button 
                onClick={() => setActiveTab('cajero-deposit')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition ${
                  activeTab === 'cajero-deposit' ? 'bg-amber-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <ArrowDownLeft className="w-4 h-4" /> Depósito Monetario
              </button>
              <button 
                onClick={() => setActiveTab('cajero-withdraw')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition ${
                  activeTab === 'cajero-withdraw' ? 'bg-amber-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <ArrowUpRight className="w-4 h-4" /> Retiro Monetario
              </button>
            </div>

            {/* Cajero Views */}
            {activeTab === 'cajero-create-account' && (
              <CajeroCreateAccount 
                accounts={db.accounts}
                onAccountCreated={(newAcc, initialDepositTx) => {
                  setDb(prev => ({
                    ...prev,
                    accounts: [...prev.accounts, newAcc],
                    transactions: [initialDepositTx, ...prev.transactions]
                  }));
                  showToast(`Cuenta Monetaria No. ${newAcc.id} creada con éxito`, 'success');
                }}
                showToast={showToast}
              />
            )}

            {activeTab === 'cajero-deposit' && (
              <CajeroDeposit 
                accounts={db.accounts}
                onDeposit={(accountNo, amount) => {
                  const today = new Date().toISOString().split('T')[0];
                  const newTx = {
                    id: `tx-${Date.now()}`,
                    date: today,
                    type: 'DEPOSITO',
                    accountNo,
                    amount: parseFloat(amount),
                    description: 'Depósito monetario en ventanilla'
                  };
                  setDb(prev => ({
                    ...prev,
                    accounts: prev.accounts.map(acc => acc.id === accountNo ? { ...acc, balance: acc.balance + parseFloat(amount) } : acc),
                    transactions: [newTx, ...prev.transactions]
                  }));
                  showToast(`Depósito de Q.${amount} procesado con éxito`, 'success');
                }}
                showToast={showToast}
              />
            )}

            {activeTab === 'cajero-withdraw' && (
              <CajeroWithdraw 
                accounts={db.accounts}
                onWithdraw={(accountNo, amount) => {
                  const today = new Date().toISOString().split('T')[0];
                  const newTx = {
                    id: `tx-${Date.now()}`,
                    date: today,
                    type: 'RETIRO',
                    accountNo,
                    amount: parseFloat(amount),
                    description: 'Retiro monetario en ventanilla'
                  };
                  setDb(prev => ({
                    ...prev,
                    accounts: prev.accounts.map(acc => acc.id === accountNo ? { ...acc, balance: acc.balance - parseFloat(amount) } : acc),
                    transactions: [newTx, ...prev.transactions]
                  }));
                  showToast(`Retiro de Q.${amount} procesado con éxito`, 'success');
                }}
                showToast={showToast}
              />
            )}
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* 4. PANEL DE USUARIO (CLIENTE)                                 */}
        {/* ------------------------------------------------------------- */}
        {currentRole === 'user' && currentUser && (
          <div className="space-y-6">
            {/* Account Card Overview */}
            {(() => {
              const myAccount = db.accounts.find(a => a.id === currentUser.accountNo);
              return (
                <div className="bg-gradient-to-r from-emerald-800 to-teal-900 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <span className="text-emerald-300 text-xs font-semibold uppercase tracking-wider">Cuenta Monetaria Principal</span>
                    <h2 className="text-2xl font-bold mt-1">{myAccount?.name || currentUser.email}</h2>
                    <p className="text-emerald-200 text-sm mt-1 font-mono">No. Cuenta: {currentUser.accountNo}</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-xl border border-white/20 text-right w-full md:w-auto">
                    <span className="text-emerald-200 text-xs font-medium block">Saldo Disponible</span>
                    <span className="text-3xl font-extrabold font-mono">
                      Q.{myAccount?.balance.toLocaleString('es-GT', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              );
            })()}

            {/* User Navigation Tabs */}
            <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-200 flex flex-wrap gap-2">
              <button 
                onClick={() => setActiveTab('user-statement')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition ${
                  activeTab === 'user-statement' ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <FileText className="w-4 h-4" /> Estado de Cuenta
              </button>
              <button 
                onClick={() => setActiveTab('user-third-party')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition ${
                  activeTab === 'user-third-party' ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <PlusCircle className="w-4 h-4" /> Agregar Cuentas Terceros
              </button>
              <button 
                onClick={() => setActiveTab('user-transfer')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition ${
                  activeTab === 'user-transfer' ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Repeat className="w-4 h-4" /> Transferencia a Terceros
              </button>
            </div>

            {/* User Tab: Estado de Cuenta */}
            {activeTab === 'user-statement' && (
              <UserAccountStatement 
                userAccountNo={currentUser.accountNo}
                transactions={db.transactions}
              />
            )}

            {/* User Tab: Agregar Cuentas Terceros */}
            {activeTab === 'user-third-party' && (
              <UserAddThirdParty 
                userAccountNo={currentUser.accountNo}
                allAccounts={db.accounts}
                userThirdParties={db.thirdPartyAccounts[currentUser.accountNo] || []}
                onAddThirdParty={(newThirdParty) => {
                  setDb(prev => {
                    const currentList = prev.thirdPartyAccounts[currentUser.accountNo] || [];
                    return {
                      ...prev,
                      thirdPartyAccounts: {
                        ...prev.thirdPartyAccounts,
                        [currentUser.accountNo]: [...currentList, newThirdParty]
                      }
                    };
                  });
                  showToast('Cuenta de tercero agregada exitosamente', 'success');
                }}
                showToast={showToast}
              />
            )}

            {/* User Tab: Transferencia a Terceros */}
            {activeTab === 'user-transfer' && (
              <UserTransferMoney 
                userAccountNo={currentUser.accountNo}
                allAccounts={db.accounts}
                thirdParties={db.thirdPartyAccounts[currentUser.accountNo] || []}
                transactions={db.transactions}
                onTransfer={(destinationAccNo, amount, alias) => {
                  const today = new Date().toISOString().split('T')[0];
                  const transferAmount = parseFloat(amount);

                  // Create transaction debited from current user
                  const txDebit = {
                    id: `tx-${Date.now()}-1`,
                    date: today,
                    type: 'TRANSFERENCIA_ENVIADA',
                    accountNo: currentUser.accountNo,
                    targetAccountNo: destinationAccNo,
                    amount: transferAmount,
                    description: `Transferencia enviada a alias: ${alias} (Cuenta: ${destinationAccNo})`
                  };

                  // Create transaction credited to target user
                  const txCredit = {
                    id: `tx-${Date.now()}-2`,
                    date: today,
                    type: 'TRANSFERENCIA_RECIBIDA',
                    accountNo: destinationAccNo,
                    targetAccountNo: currentUser.accountNo,
                    amount: transferAmount,
                    description: `Transferencia recibida desde cuenta: ${currentUser.accountNo}`
                  };

                  setDb(prev => ({
                    ...prev,
                    accounts: prev.accounts.map(acc => {
                      if (acc.id === currentUser.accountNo) return { ...acc, balance: acc.balance - transferAmount };
                      if (acc.id === destinationAccNo) return { ...acc, balance: acc.balance + transferAmount };
                      return acc;
                    }),
                    transactions: [txDebit, txCredit, ...prev.transactions]
                  }));

                  showToast(`Transferencia de Q.${transferAmount} completada con éxito.`, 'success');
                }}
                showToast={showToast}
              />
            )}
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-6 text-center text-xs border-t border-slate-800 mt-auto">
        <p>© 2026 Banco Nexus, S.A. Todos los derechos reservados. Sistema de Banca en Línea Responsivo.</p>
      </footer>
    </div>
  );
}

// ==========================================
// COMPONENTES AUXILIARES Y FORMULARIOS
// ==========================================

// --- Form: Login Admin ---
function AdminLoginForm({ onLoginSuccess, showToast, onCancel }) {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (user === 'admin' && pass === 'admin123') {
      onLoginSuccess({ username: 'admin' });
    } else {
      showToast('Credenciales de Administrador incorrectas', 'error');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-md border border-slate-200">
      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center mx-auto mb-2">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-bold text-slate-900">Acceso Administrador</h3>
        <p className="text-xs text-slate-500">Ingrese sus credenciales administrativas</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Usuario</label>
          <input 
            type="text" 
            required 
            value={user} 
            onChange={e => setUser(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
            placeholder="admin"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Contraseña</label>
          <input 
            type="password" 
            required 
            value={pass} 
            onChange={e => setPass(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
            placeholder="••••••••"
          />
        </div>
        <button type="submit" className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition text-sm">
          Iniciar Sesión Admin
        </button>
        <button type="button" onClick={onCancel} className="w-full py-2 text-slate-500 hover:text-slate-700 text-xs">
          Regresar a la página principal
        </button>
      </form>
    </div>
  );
}

// --- Form: Login Cajero ---
function CajeroLoginForm({ cajeros, onLoginSuccess, showToast, onCancel }) {
  const [username, setUsername] = useState('');
  const [pass, setPass] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const found = cajeros.find(c => c.username === username && c.pass === pass);
    if (!found) {
      showToast('Usuario o contraseña de cajero inválidos', 'error');
      return;
    }
    if (found.blocked) {
      showToast('Su usuario de cajero se encuentra bloqueado por la administración', 'error');
      return;
    }
    onLoginSuccess(found);
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-md border border-slate-200">
      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto mb-2">
          <Building2 className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-bold text-slate-900">Acceso Cajero</h3>
        <p className="text-xs text-slate-500">Ingrese sus credenciales de ventanilla</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Usuario Cajero</label>
          <input 
            type="text" 
            required 
            value={username} 
            onChange={e => setUsername(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-sm"
            placeholder="cajero1"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Contraseña</label>
          <input 
            type="password" 
            required 
            value={pass} 
            onChange={e => setPass(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-sm"
            placeholder="••••••••"
          />
        </div>
        <button type="submit" className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg transition text-sm">
          Iniciar Sesión Cajero
        </button>
        <button type="button" onClick={onCancel} className="w-full py-2 text-slate-500 hover:text-slate-700 text-xs">
          Regresar a la página principal
        </button>
      </form>
    </div>
  );
}

// --- Form: Login Usuario Cliente ---
function UserLoginForm({ users, onLoginSuccess, showToast, onCancel }) {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const found = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.pass === pass);
    if (found) {
      onLoginSuccess(found);
    } else {
      showToast('Correo electrónico o contraseña incorrectos', 'error');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-md border border-slate-200">
      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-2">
          <UserCheck className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-bold text-slate-900">Banca en Línea - Clientes</h3>
        <p className="text-xs text-slate-500">Ingrese con su correo registrado</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Correo Electrónico</label>
          <input 
            type="email" 
            required 
            value={email} 
            onChange={e => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
            placeholder="juan@gmail.com"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Contraseña</label>
          <input 
            type="password" 
            required 
            value={pass} 
            onChange={e => setPass(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
            placeholder="••••••••"
          />
        </div>
        <button type="submit" className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition text-sm">
          Ingresar al Portal
        </button>
        <button type="button" onClick={onCancel} className="w-full py-2 text-slate-500 hover:text-slate-700 text-xs">
          Regresar a la página principal
        </button>
      </form>
    </div>
  );
}

// --- Form: Registro de Nuevo Usuario Cliente ---
function RegisterUserForm({ db, onRegisterSuccess, showToast, onCancel }) {
  const [accountNo, setAccountNo] = useState('');
  const [email, setEmail] = useState('');
  const [dpi, setDpi] = useState('');
  const [pass, setPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validations:
    // 1. Passwords match
    if (pass !== confirmPass) {
      showToast('Las contraseñas no coinciden', 'error');
      return;
    }

    // 2. Account must exist (created by cashier)
    const existingAccount = db.accounts.find(a => a.id === accountNo);
    if (!existingAccount) {
      showToast('La cuenta bancaria ingresada no existe. Debe crearla previamente con un cajero en agencia.', 'error');
      return;
    }

    // 3. DPI must match account holder DPI
    if (existingAccount.dpi !== dpi) {
      showToast('El DPI ingresado no coincide con el registrado en la cuenta bancaria.', 'error');
      return;
    }

    // 4. Verify no other user is already registered for this bank account
    const existingUser = db.users.find(u => u.accountNo === accountNo);
    if (existingUser) {
      showToast('Esta cuenta bancaria ya posee un usuario registrado en banca en línea.', 'error');
      return;
    }

    // 5. Verify email uniqueness
    const existingEmail = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existingEmail) {
      showToast('Este correo electrónico ya se encuentra registrado por otro usuario.', 'error');
      return;
    }

    const newUser = {
      email,
      dpi,
      accountNo,
      pass,
      registeredAt: new Date().toISOString().split('T')[0]
    };

    onRegisterSuccess(newUser);
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-8 rounded-2xl shadow-md border border-slate-200">
      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-2">
          <UserPlus className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-bold text-slate-900">Registro de Banca en Línea</h3>
        <p className="text-xs text-slate-500">Active su usuario de acceso web con su cuenta de banco existente</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">No. Cuenta Bancaria</label>
          <input 
            type="text" 
            required 
            value={accountNo} 
            onChange={e => setAccountNo(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
            placeholder="Ej: 1001"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">DPI del Titular</label>
          <input 
            type="text" 
            required 
            value={dpi} 
            onChange={e => setDpi(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
            placeholder="Ej: 1234567890101"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Correo Electrónico (Usuario)</label>
          <input 
            type="email" 
            required 
            value={email} 
            onChange={e => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
            placeholder="correo@ejemplo.com"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Contraseña</label>
            <input 
              type="password" 
              required 
              value={pass} 
              onChange={e => setPass(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
              placeholder="••••••••"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Confirmar Contraseña</label>
            <input 
              type="password" 
              required 
              value={confirmPass} 
              onChange={e => setConfirmPass(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
              placeholder="••••••••"
            />
          </div>
        </div>

        <button type="submit" className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition text-sm">
          Completar Registro
        </button>
        <button type="button" onClick={onCancel} className="w-full py-2 text-slate-500 hover:text-slate-700 text-xs">
          Regresar
        </button>
      </form>
    </div>
  );
}

// --- Admin Section 1: Gestión de Cajeros ---
function AdminCajerosManager({ cajeros, onToggleBlock, onAddCajero, showToast }) {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [pass, setPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');

  const handleCreateCajero = (e) => {
    e.preventDefault();
    if (pass !== confirmPass) {
      showToast('Las contraseñas no coinciden', 'error');
      return;
    }
    if (cajeros.some(c => c.username.toLowerCase() === username.toLowerCase())) {
      showToast('Nombre de usuario de cajero ya existe', 'error');
      return;
    }

    onAddCajero({
      id: `c-${Date.now()}`,
      name,
      username,
      pass,
      blocked: false
    });

    setName('');
    setUsername('');
    setPass('');
    setConfirmPass('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Form: Nuevo Cajero */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h3 className="font-bold text-slate-900 text-lg mb-4 flex items-center gap-2">
          <PlusCircle className="w-5 h-5 text-indigo-600" /> Registrar Nuevo Cajero
        </h3>
        <form onSubmit={handleCreateCajero} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Nombre Completo</label>
            <input 
              type="text" 
              required 
              value={name} 
              onChange={e => setName(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
              placeholder="Carlos Mendoza"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Usuario</label>
            <input 
              type="text" 
              required 
              value={username} 
              onChange={e => setUsername(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
              placeholder="cajero3"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Clave</label>
            <input 
              type="password" 
              required 
              value={pass} 
              onChange={e => setPass(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
              placeholder="••••••••"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Confirmación de Clave</label>
            <input 
              type="password" 
              required 
              value={confirmPass} 
              onChange={e => setConfirmPass(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
              placeholder="••••••••"
            />
          </div>
          <button type="submit" className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition text-sm">
            Guardar Cajero
          </button>
        </form>
      </div>

      {/* Table: Listado de Cajeros */}
      <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h3 className="font-bold text-slate-900 text-lg mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-indigo-600" /> Listado de Usuarios Cajeros
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-xs">
              <tr>
                <th className="p-3">Nombre Completo</th>
                <th className="p-3">Usuario</th>
                <th className="p-3">Estado</th>
                <th className="p-3 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {cajeros.map(cajero => (
                <tr key={cajero.id} className="hover:bg-slate-50">
                  <td className="p-3 font-medium">{cajero.name}</td>
                  <td className="p-3 font-mono">{cajero.username}</td>
                  <td className="p-3">
                    {cajero.blocked ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-800">
                        <Lock className="w-3 h-3" /> Bloqueado
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                        <Unlock className="w-3 h-3" /> Activo
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-right">
                    <button 
                      onClick={() => onToggleBlock(cajero.id)}
                      className={`px-3 py-1 rounded text-xs font-bold transition ${
                        cajero.blocked 
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                          : 'bg-red-600 hover:bg-red-700 text-white'
                      }`}
                    >
                      {cajero.blocked ? 'Desbloquear' : 'Bloquear'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// --- Admin Section 2: Monitor de Transferencias ---
function AdminMonitor({ db }) {
  const today = new Date().toISOString().split('T')[0];

  // Calculos métricos del día
  const accountsCreatedToday = db.accounts.filter(a => a.createdAt === today).length;
  const usersRegisteredToday = db.users.filter(u => u.registeredAt === today).length;
  
  const todayTxList = db.transactions.filter(t => t.date === today);
  const totalTxCount = db.transactions.length;
  
  const totalDepositsCount = db.transactions.filter(t => t.type === 'DEPOSITO').length;
  const totalWithdrawalsCount = db.transactions.filter(t => t.type === 'RETIRO').length;

  const totalDepositsMoney = db.transactions
    .filter(t => t.type === 'DEPOSITO')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalWithdrawalsMoney = db.transactions
    .filter(t => t.type === 'RETIRO' || t.type === 'TRANSFERENCIA_ENVIADA')
    .reduce((sum, t) => sum + t.amount, 0);

  // SVG Chart Calculations
  const maxVal = Math.max(totalDepositsMoney, totalWithdrawalsMoney, 1);
  const depHeight = Math.round((totalDepositsMoney / maxVal) * 100);
  const witHeight = Math.round((totalWithdrawalsMoney / maxVal) * 100);

  return (
    <div className="space-y-6">
      {/* Sección 1: Indicadores métricos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
          <p className="text-xs font-bold text-slate-500 uppercase">Cuentas Creadas Hoy</p>
          <p className="text-3xl font-extrabold text-slate-900 mt-2">{accountsCreatedToday}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
          <p className="text-xs font-bold text-slate-500 uppercase">Clientes Registrados Hoy</p>
          <p className="text-3xl font-extrabold text-slate-900 mt-2">{usersRegisteredToday}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
          <p className="text-xs font-bold text-slate-500 uppercase">Total Transacciones</p>
          <p className="text-3xl font-extrabold text-slate-900 mt-2">{totalTxCount}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
          <p className="text-xs font-bold text-slate-500 uppercase">Cant. Depósitos</p>
          <p className="text-3xl font-extrabold text-emerald-600 mt-2">{totalDepositsCount}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
          <p className="text-xs font-bold text-slate-500 uppercase">Cant. Retiros</p>
          <p className="text-3xl font-extrabold text-red-600 mt-2">{totalWithdrawalsCount}</p>
        </div>
      </div>

      {/* Sección 2: Gráfica Interactiva Monetaria Depósitos vs Retiros */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h3 className="font-bold text-slate-900 text-lg mb-2 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-indigo-600" /> Monto Monetario: Depósitos vs Retiros
        </h3>
        <p className="text-xs text-slate-500 mb-6">Comparativa global del flujo de efectivo acumulado en el sistema.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Gráfica de barras personalizada SVG */}
          <div className="h-64 bg-slate-50 p-6 rounded-xl flex items-end justify-center gap-12 border border-slate-100">
            {/* Depósitos Bar */}
            <div className="flex flex-col items-center gap-2 h-full justify-end w-24">
              <span className="text-xs font-bold text-emerald-700">Q.{totalDepositsMoney.toLocaleString()}</span>
              <div 
                className="w-full bg-emerald-500 rounded-t-lg transition-all duration-500 hover:bg-emerald-600 shadow"
                style={{ height: `${Math.max(depHeight, 5)}%` }}
              ></div>
              <span className="text-xs font-bold uppercase text-slate-600 mt-2">Depósitos</span>
            </div>

            {/* Retiros Bar */}
            <div className="flex flex-col items-center gap-2 h-full justify-end w-24">
              <span className="text-xs font-bold text-red-700">Q.{totalWithdrawalsMoney.toLocaleString()}</span>
              <div 
                className="w-full bg-red-500 rounded-t-lg transition-all duration-500 hover:bg-red-600 shadow"
                style={{ height: `${Math.max(witHeight, 5)}%` }}
              ></div>
              <span className="text-xs font-bold uppercase text-slate-600 mt-2">Retiros</span>
            </div>
          </div>

          {/* Resumen numérico al lado de la gráfica */}
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
              <span className="text-xs font-bold text-emerald-800 uppercase">Monto Total en Depósitos</span>
              <p className="text-2xl font-extrabold text-emerald-900 mt-1">
                Q.{totalDepositsMoney.toLocaleString('es-GT', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-red-50 border border-red-200">
              <span className="text-xs font-bold text-red-800 uppercase">Monto Total en Retiros / Transferencias</span>
              <p className="text-2xl font-extrabold text-red-900 mt-1">
                Q.{totalWithdrawalsMoney.toLocaleString('es-GT', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Cajero Task 1: Crear Cuenta Monetaria ---
function CajeroCreateAccount({ accounts, onAccountCreated, showToast }) {
  const [name, setName] = useState('');
  const [accountNo, setAccountNo] = useState(String(1001 + accounts.length));
  const [dpi, setDpi] = useState('');
  const [initialAmount, setInitialAmount] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const amount = parseFloat(initialAmount);

    if (isNaN(amount) || amount < 0) {
      showToast('El monto inicial debe ser mayor o igual a 0', 'error');
      return;
    }

    if (accounts.some(a => a.id === accountNo)) {
      showToast('El número de cuenta ya existe en la base de datos', 'error');
      return;
    }

    const today = new Date().toISOString().split('T')[0];

    const newAcc = {
      id: accountNo,
      name,
      dpi,
      balance: amount,
      createdAt: today
    };

    const initialDepositTx = {
      id: `tx-${Date.now()}`,
      date: today,
      type: 'DEPOSITO',
      accountNo: accountNo,
      amount: amount,
      description: 'Apertura de cuenta monetaria'
    };

    onAccountCreated(newAcc, initialDepositTx);

    setName('');
    setAccountNo(String(1002 + accounts.length));
    setDpi('');
    setInitialAmount('');
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
      <h3 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-2">
        <UserPlus className="w-6 h-6 text-amber-600" /> Crear Nueva Cuenta Monetaria
      </h3>
      <p className="text-xs text-slate-500 mb-6">Apertura de cuenta bancaria presencial para cliente en ventanilla.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Nombre Completo del Titular</label>
          <input 
            type="text" 
            required 
            value={name} 
            onChange={e => setName(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-sm"
            placeholder="Ej: Mario Estrada"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">No. Cuenta Bancaria</label>
            <input 
              type="text" 
              required 
              value={accountNo} 
              onChange={e => setAccountNo(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-sm font-mono"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Identificación (DPI)</label>
            <input 
              type="text" 
              required 
              value={dpi} 
              onChange={e => setDpi(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-sm"
              placeholder="13 dígitos"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Monto Inicial (Q)</label>
          <input 
            type="number" 
            min="0"
            step="0.01"
            required 
            value={initialAmount} 
            onChange={e => setInitialAmount(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-sm font-mono"
            placeholder="0.00"
          />
        </div>

        <button type="submit" className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg transition text-sm">
          Registrar Cuenta Monetaria
        </button>
      </form>
    </div>
  );
}

// --- Cajero Task 2: Depósito Monetario ---
function CajeroDeposit({ accounts, onDeposit, showToast }) {
  const [accountNo, setAccountNo] = useState('');
  const [amount, setAmount] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const targetAcc = accounts.find(a => a.id === accountNo);
    if (!targetAcc) {
      showToast('El número de cuenta bancaria no existe', 'error');
      return;
    }
    if (parseFloat(amount) <= 0) {
      showToast('El monto debe ser mayor a 0', 'error');
      return;
    }

    onDeposit(accountNo, amount);
    setAccountNo('');
    setAmount('');
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
      <h3 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-2">
        <ArrowDownLeft className="w-6 h-6 text-amber-600" /> Depósito Monetario
      </h3>
      <p className="text-xs text-slate-500 mb-6">Abonar fondos a una cuenta bancaria.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">No. Cuenta Destino</label>
          <input 
            type="text" 
            required 
            value={accountNo} 
            onChange={e => setAccountNo(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-sm font-mono"
            placeholder="Ej: 1001"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Cantidad a Depositar (Q)</label>
          <input 
            type="number" 
            min="0.01"
            step="0.01"
            required 
            value={amount} 
            onChange={e => setAmount(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-sm font-mono"
            placeholder="500.00"
          />
        </div>

        <button type="submit" className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg transition text-sm">
          Efectuar Depósito
        </button>
      </form>
    </div>
  );
}

// --- Cajero Task 3: Retiro Monetario ---
function CajeroWithdraw({ accounts, onWithdraw, showToast }) {
  const [accountNo, setAccountNo] = useState('');
  const [amount, setAmount] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const targetAcc = accounts.find(a => a.id === accountNo);
    if (!targetAcc) {
      showToast('El número de cuenta bancaria no existe', 'error');
      return;
    }
    const withdrawVal = parseFloat(amount);
    if (withdrawVal <= 0) {
      showToast('El monto debe ser mayor a 0', 'error');
      return;
    }
    if (withdrawVal > targetAcc.balance) {
      showToast(`Fondos insuficientes. Saldo disponible en cuenta: Q.${targetAcc.balance}`, 'error');
      return;
    }

    onWithdraw(accountNo, amount);
    setAccountNo('');
    setAmount('');
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
      <h3 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-2">
        <ArrowUpRight className="w-6 h-6 text-amber-600" /> Retiro Monetario
      </h3>
      <p className="text-xs text-slate-500 mb-6">Debitar fondos de una cuenta bancaria.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">No. Cuenta Origen</label>
          <input 
            type="text" 
            required 
            value={accountNo} 
            onChange={e => setAccountNo(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-sm font-mono"
            placeholder="Ej: 1001"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Cantidad a Debitante (Q)</label>
          <input 
            type="number" 
            min="0.01"
            step="0.01"
            required 
            value={amount} 
            onChange={e => setAmount(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-sm font-mono"
            placeholder="200.00"
          />
        </div>

        <button type="submit" className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg transition text-sm">
          Procesar Retiro
        </button>
      </form>
    </div>
  );
}

// --- User Task 1: Agregar Cuentas Terceros ---
function UserAddThirdParty({ userAccountNo, allAccounts, userThirdParties, onAddThirdParty, showToast }) {
  const [accountNo, setAccountNo] = useState('');
  const [alias, setAlias] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
  const [maxDailyTx, setMaxDailyTx] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (accountNo === userAccountNo) {
      showToast('No puede agregar su propia cuenta como cuenta de tercero', 'error');
      return;
    }

    const existingTarget = allAccounts.find(a => a.id === accountNo);
    if (!existingTarget) {
      showToast('La cuenta bancaria ingresada no existe en el sistema', 'error');
      return;
    }

    if (userThirdParties.some(tp => tp.accountNo === accountNo)) {
      showToast('Esta cuenta ya la tiene agregada en su lista de terceros', 'error');
      return;
    }

    onAddThirdParty({
      accountNo,
      alias,
      maxAmount: parseFloat(maxAmount),
      maxDailyTx: parseInt(maxDailyTx, 10)
    });

    setAccountNo('');
    setAlias('');
    setMaxAmount('');
    setMaxDailyTx('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h3 className="font-bold text-slate-900 text-lg mb-4 flex items-center gap-2">
          <PlusCircle className="w-5 h-5 text-emerald-600" /> Registrar Cuenta Tercero
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">No. Cuenta Destino</label>
            <input 
              type="text" 
              required 
              value={accountNo} 
              onChange={e => setAccountNo(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-mono"
              placeholder="Ej: 1002"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Alias de la Cuenta</label>
            <input 
              type="text" 
              required 
              value={alias} 
              onChange={e => setAlias(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
              placeholder="Ej: Mamá Ahorros"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Monto Máximo por Operación (Q)</label>
            <input 
              type="number" 
              min="1"
              required 
              value={maxAmount} 
              onChange={e => setMaxAmount(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-mono"
              placeholder="1000.00"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Cant. Máxima Transacciones Diarias</label>
            <input 
              type="number" 
              min="1"
              required 
              value={maxDailyTx} 
              onChange={e => setMaxDailyTx(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-mono"
              placeholder="3"
            />
          </div>

          <button type="submit" className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition text-sm">
            Guardar Cuenta Tercero
          </button>
        </form>
      </div>

      <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h3 className="font-bold text-slate-900 text-lg mb-4 flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-emerald-600" /> Mis Cuentas de Terceros Registradas
        </h3>
        {userThirdParties.length === 0 ? (
          <p className="text-slate-500 text-sm italic">No tiene cuentas de terceros agregadas aún.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-xs">
                <tr>
                  <th className="p-3">Alias</th>
                  <th className="p-3">No. Cuenta</th>
                  <th className="p-3">Monto Máx / Tx</th>
                  <th className="p-3">Límite Diario</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {userThirdParties.map((tp, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="p-3 font-medium text-slate-900">{tp.alias}</td>
                    <td className="p-3 font-mono text-slate-600">{tp.accountNo}</td>
                    <td className="p-3 font-mono font-bold text-emerald-700">Q.{tp.maxAmount}</td>
                    <td className="p-3 font-mono">{tp.maxDailyTx} tx/día</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// --- User Task 2: Transferencia a Cuentas Terceros ---
function UserTransferMoney({ userAccountNo, allAccounts, thirdParties, transactions, onTransfer, showToast }) {
  const [selectedAccountNo, setSelectedAccountNo] = useState('');
  const [amount, setAmount] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedAccountNo) {
      showToast('Seleccione una cuenta de tercero', 'error');
      return;
    }

    const tpConfig = thirdParties.find(tp => tp.accountNo === selectedAccountNo);
    if (!tpConfig) {
      showToast('Configuración de cuenta tercero no encontrada', 'error');
      return;
    }

    const transferAmount = parseFloat(amount);

    if (isNaN(transferAmount) || transferAmount <= 0) {
      showToast('Ingrese un monto válido', 'error');
      return;
    }

    // 1. Validar Saldo Disponible
    const myAccount = allAccounts.find(a => a.id === userAccountNo);
    if (myAccount.balance < transferAmount) {
      showToast(`Saldo insuficiente. Su saldo actual es Q.${myAccount.balance}`, 'error');
      return;
    }

    // 2. Validar Monto Máximo Permitido para esa cuenta
    if (transferAmount > tpConfig.maxAmount) {
      showToast(`El monto excede el límite máximo permitido de Q.${tpConfig.maxAmount} para esta cuenta`, 'error');
      return;
    }

    // 3. Validar Transacciones Diarias
    const today = new Date().toISOString().split('T')[0];
    const dailyTxCount = transactions.filter(t => 
      t.date === today && 
      t.accountNo === userAccountNo && 
      t.targetAccountNo === selectedAccountNo
    ).length;

    if (dailyTxCount >= tpConfig.maxDailyTx) {
      showToast(`Ha alcanzado el límite máximo diario de ${tpConfig.maxDailyTx} transacciones para esta cuenta.`, 'error');
      return;
    }

    onTransfer(selectedAccountNo, amount, tpConfig.alias);
    setAmount('');
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
      <h3 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-2">
        <Repeat className="w-6 h-6 text-emerald-600" /> Transferencia a Cuentas de Terceros
      </h3>
      <p className="text-xs text-slate-500 mb-6">Realice transferencias inmediatas bajo contexto seguro de transacción.</p>

      {thirdParties.length === 0 ? (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-sm">
          No tiene cuentas de terceros registradas. Primero debe registrar una cuenta en la pestaña <strong>"Agregar Cuentas Terceros"</strong>.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Seleccionar Cuenta de Tercero</label>
            <select 
              required
              value={selectedAccountNo} 
              onChange={e => setSelectedAccountNo(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm bg-white"
            >
              <option value="">-- Seleccione una cuenta --</option>
              {thirdParties.map((tp, idx) => (
                <option key={idx} value={tp.accountNo}>
                  {tp.alias} (Cuenta: {tp.accountNo}) - Máx: Q.{tp.maxAmount}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Monto a Transferir (Q)</label>
            <input 
              type="number" 
              min="0.01"
              step="0.01"
              required 
              value={amount} 
              onChange={e => setAmount(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-mono"
              placeholder="0.00"
            />
          </div>

          {selectedAccountNo && (() => {
            const selectedTp = thirdParties.find(tp => tp.accountNo === selectedAccountNo);
            const today = new Date().toISOString().split('T')[0];
            const dailyTxCount = transactions.filter(t => 
              t.date === today && 
              t.accountNo === userAccountNo && 
              t.targetAccountNo === selectedAccountNo
            ).length;

            return (
              <div className="p-3 bg-slate-50 border rounded-lg text-xs space-y-1 text-slate-600">
                <p><strong>Límite de monto por transacción:</strong> Q.{selectedTp.maxAmount}</p>
                <p><strong>Transacciones realizadas hoy:</strong> {dailyTxCount} de {selectedTp.maxDailyTx} permitidas</p>
              </div>
            );
          })()}

          <button type="submit" className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition text-sm">
            Ejecutar Transferencia
          </button>
        </form>
      )}
    </div>
  );
}

// --- User Task 3: Estado de Cuenta ---
function UserAccountStatement({ userAccountNo, transactions }) {
  // Filter transactions pertaining to logged in user's account
  const myTx = transactions.filter(t => t.accountNo === userAccountNo);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      <h3 className="font-bold text-slate-900 text-lg mb-4 flex items-center gap-2">
        <FileText className="w-5 h-5 text-emerald-600" /> Estado de Cuenta Histórico
      </h3>

      {myTx.length === 0 ? (
        <p className="text-slate-500 text-sm italic">No se han registrado operaciones en esta cuenta aún.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-xs">
              <tr>
                <th className="p-3">Fecha</th>
                <th className="p-3">Tipo Movimiento</th>
                <th className="p-3">Descripción</th>
                <th className="p-3 text-right">Monto</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {myTx.map((tx) => {
                const isCredit = tx.type === 'DEPOSITO' || tx.type === 'TRANSFERENCIA_RECIBIDA';
                return (
                  <tr key={tx.id} className="hover:bg-slate-50">
                    <td className="p-3 font-mono text-xs text-slate-500">{tx.date}</td>
                    <td className="p-3 font-medium">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        isCredit ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {isCredit ? <ArrowDownLeft className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
                        {tx.type}
                      </span>
                    </td>
                    <td className="p-3 text-slate-600">{tx.description}</td>
                    <td className={`p-3 text-right font-mono font-bold ${
                      isCredit ? 'text-emerald-600' : 'text-red-600'
                    }`}>
                      {isCredit ? '+' : '-'}Q.{tx.amount.toLocaleString('es-GT', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}