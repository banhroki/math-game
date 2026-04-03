/**
 * db.js — localStorage ベースのアカウント管理
 * 
 * アカウント構造:
 * {
 *   id: string,
 *   name: string,
 *   pin: string (4桁),
 *   iconId: number,
 *   theme: string,
 *   diff: string,
 *   lang: string,
 *   sealCount: number,
 *   pendingSeals: number,
 *   sealGrid: array(100),
 *   milestones: object,
 *   stats: { totalCorrect, totalQ, byMode:{} }
 * }
 */

const DB = (() => {
  const KEY_ACCOUNTS = 'mathgame_accounts';
  const KEY_SESSION  = 'mathgame_session';

  function getAll() {
    try { return JSON.parse(localStorage.getItem(KEY_ACCOUNTS)) || []; }
    catch(e) { return []; }
  }
  function saveAll(accounts) {
    localStorage.setItem(KEY_ACCOUNTS, JSON.stringify(accounts));
  }

  function makeId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2,6);
  }

  function createAccount(name, pin, iconId) {
    const accounts = getAll();
    if (accounts.find(a => a.name === name)) return { ok: false, msg: 'その名前はすでにつかわれています' };
    const acc = {
      id: makeId(), name, pin, iconId,
      theme: 'th-sky', diff: 'easy', lang: 'ja',
      sealCount: 0, pendingSeals: 0,
      sealGrid: Array(100).fill(null),
      milestones: {},
      stats: { totalCorrect: 0, totalQ: 0, byMode: {} }
    };
    accounts.push(acc);
    saveAll(accounts);
    return { ok: true, account: acc };
  }

  function login(name, pin) {
    const acc = getAll().find(a => a.name === name);
    if (!acc) return { ok: false, msg: 'なまえがみつかりません' };
    if (acc.pin !== pin) return { ok: false, msg: 'パスワードがちがいます' };
    sessionStorage.setItem(KEY_SESSION, acc.id);
    return { ok: true, account: acc };
  }

  function loginById(id, pin) {
    const acc = getAll().find(a => a.id === id);
    if (!acc) return { ok: false, msg: 'アカウントがみつかりません' };
    if (acc.pin !== pin) return { ok: false, msg: 'パスワードがちがいます' };
    sessionStorage.setItem(KEY_SESSION, acc.id);
    return { ok: true, account: acc };
  }

  function logout() {
    sessionStorage.removeItem(KEY_SESSION);
  }

  function currentId() {
    return sessionStorage.getItem(KEY_SESSION);
  }

  function current() {
    const id = currentId();
    if (!id) return null;
    return getAll().find(a => a.id === id) || null;
  }

  function update(fields) {
    const id = currentId();
    if (!id) return;
    const accounts = getAll();
    const idx = accounts.findIndex(a => a.id === id);
    if (idx < 0) return;
    Object.assign(accounts[idx], fields);
    saveAll(accounts);
  }

  return { getAll, createAccount, login, loginById, logout, current, currentId, update };
})();