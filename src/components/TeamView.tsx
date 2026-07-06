import React, { useState } from 'react';
import { 
  Users2, 
  Plus, 
  ShieldCheck, 
  Mail, 
  Trash2, 
  Check, 
  RefreshCw, 
  UserPlus, 
  Compass,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TeamMember } from '../types';
import { motion } from 'motion/react';

interface TeamViewProps {
  teamMembers: TeamMember[];
  onInviteMember: (member: Omit<TeamMember, 'id'>) => void;
  onRemoveMember: (id: string) => void;
}

export function TeamView({ teamMembers, onInviteMember, onRemoveMember }: TeamViewProps) {
  // Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('All');

  // Modal Setup
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Accountant');
  const [permissions, setPermissions] = useState<string[]>(['View Bills']);

  const rolesList = ['Owner', 'Finance Manager', 'Accountant', 'Billing Clerk'];
  const permissionsOptions = ['Compose Bills', 'View Bills', 'Apply Settle Receipts', 'Config Ledger Settings'];

  const handleTogglePermission = (perm: string) => {
    if (permissions.includes(perm)) {
      setPermissions(permissions.filter(p => p !== perm));
    } else {
      setPermissions([...permissions, perm]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    onInviteMember({
      name,
      email,
      role,
      status: 'Invited',
      permissions
    });

    // Reset Form state fields
    setName('');
    setEmail('');
    setRole('Accountant');
    setPermissions(['View Bills']);
    setIsModalOpen(false);
  };

  const filteredTeam = teamMembers.filter((m) => {
    const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          m.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'All' || m.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.38, ease: 'easeOut' }}
      className="space-y-6" 
      id="team-workspace"
    >
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4" id="team-header">
        <div>
          <h1 className="text-xl font-bold font-sans text-slate-800 tracking-tight">Enterprise Organization Seat Logs</h1>
          <p className="text-xs text-slate-500">Add finance analysts, billing clerks, or administrative audit pools to coordinate cash ledger compositions</p>
        </div>
        <Button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md text-xs h-9 px-4 flex items-center gap-1.5 cursor-pointer shadow-sm ml-auto sm:ml-0"
        >
          <UserPlus className="size-4" />
          Invite Corporate Seat
        </Button>
      </div>

      {/* Main content pane */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6" id="team-screen-split">
        {/* Statistics side cards (Left) */}
        <div className="space-y-6 lg:col-span-1" id="team-sidebar-col">
          <Card className="border border-slate-200 shadow-sm rounded-xl overflow-hidden bg-white">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-3.5 px-4">
              <CardTitle className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Seat Metrics</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-[8px] text-slate-400 font-extrabold uppercase block">Active Seats</span>
                  <span className="font-mono text-base font-bold text-slate-800 mt-0.5">
                    {teamMembers.filter(t => t.status === 'Active').length}
                  </span>
                </div>
                <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-[8px] text-slate-400 font-extrabold uppercase block">Invited Core</span>
                  <span className="font-mono text-base font-bold text-slate-800 mt-0.5">
                    {teamMembers.filter(t => t.status === 'Invited').length}
                  </span>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-3 text-[10px] text-slate-500 space-y-1">
                <div className="flex justify-between items-center">
                  <span>Capacity Index:</span>
                  <span className="font-mono font-bold text-slate-800">{teamMembers.length} / 8 seats occupied</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1">
                  <div className="h-full bg-blue-600 rounded-full transition-all" style={{ width: `${(teamMembers.length / 8) * 100}%` }} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Members registry list (Right) */}
        <div className="lg:col-span-3 space-y-4" id="team-registry-col">
          {/* Filtration toolbar */}
          <div className="flex flex-col sm:flex-row gap-3 bg-white p-3 rounded-lg border border-slate-200 shadow-xs text-xs" id="team-filters-bar">
            <div className="flex-1">
              <Input 
                type="text" 
                placeholder="Search colleagues by full name, enterprise email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-8 text-xs border-slate-200 bg-white"
              />
            </div>
            <div>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="px-2.5 h-8 rounded-md border border-slate-200 bg-white font-medium text-xs focus:outline-none focus:border-blue-500 w-full sm:w-[160px]"
              >
                <option value="All">All Assigned Roles</option>
                {rolesList.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
          </div>

          {/* Listing Grid / Table */}
          <div className="bg-white rounded-xl border border-slate-205 shadow-sm overflow-x-auto w-full" id="team-table-wrapper">
            <table className="w-full text-left text-xs min-w-[700px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  <th className="py-2.5 px-4 font-semibold">Corporate Colleague</th>
                  <th className="py-2.5 px-2 font-semibold">Assigned Role</th>
                  <th className="py-2.5 px-2 font-semibold">Allowed Permissions</th>
                  <th className="py-2.5 px-2 font-semibold text-center">Connection State</th>
                  <th className="py-2.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTeam.length > 0 ? (
                  filteredTeam.map((member) => (
                    <tr key={member.id} className="hover:bg-slate-50/20 text-slate-750 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          {/* Circle Avatar representation initials */}
                          <div className="size-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center font-bold text-blue-600 text-[11px] shrink-0 font-sans uppercase">
                            {member.name.substring(0, 2)}
                          </div>
                          <div className="space-y-0.5">
                            <span className="font-bold text-slate-800 block text-xs">{member.name}</span>
                            <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                              <Mail className="size-3 text-slate-300" />
                              {member.email}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-2">
                        <Badge className="bg-slate-50 border border-slate-200 text-slate-650 hover:bg-slate-100 font-bold text-[9px] uppercase px-1.5 py-0">
                          {member.role}
                        </Badge>
                      </td>
                      <td className="py-3 px-2 font-medium text-slate-500">
                        <div className="flex flex-wrap gap-1 max-w-[240px]">
                          {member.permissions.map((p) => (
                            <span key={p} className="bg-blue-50/20 border border-blue-100/50 text-blue-700 text-[8px] font-bold px-1 rounded-xs uppercase tracking-wider">
                              {p}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-2 text-center">
                        <Badge className={`font-extrabold text-[8px] uppercase px-1.5 py-0 border ${
                          member.status === 'Active' 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                            : 'bg-amber-50 text-amber-700 border-amber-100'
                        }`}>
                          {member.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right">
                        {member.role !== 'Owner' ? (
                          <Button
                            onClick={() => onRemoveMember(member.id)}
                            variant="ghost" 
                            size="sm" 
                            className="size-7 p-0 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50/50 cursor-pointer"
                            title="Deauthorize Seat"
                          >
                            <Trash2 className="size-3.5" />
                          </Button>
                        ) : (
                          <span className="text-[10px] text-slate-400 text-right pr-2 font-bold uppercase tracking-wider select-none">Unbreakable</span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400 font-medium bg-slate-50/55 rounded-b-xl">
                      No matching seat accounts discovered in team filter checks.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Invite Member modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn" id="team-invite-modal">
          <Card className="w-full max-w-sm border border-slate-200 shadow-2xl bg-white rounded-xl overflow-hidden">
            <CardHeader className="bg-slate-50 border-b border-slate-100 p-4">
              <CardTitle className="text-xs font-bold text-slate-800 uppercase tracking-widest flex items-center gap-2">
                <Plus className="size-4 text-blue-600" />
                Invite Enterprise Seat
              </CardTitle>
              <CardDescription className="text-[10px] text-slate-500">Provide registration details to authorize invoice compose and audit tasks.</CardDescription>
            </CardHeader>
            <CardContent className="p-5">
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Full Name *</label>
                  <Input 
                    type="text" 
                    required 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-8 text-xs border-slate-200 focus:border-blue-500 rounded-md"
                    placeholder="e.g. Sarah Connor"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Enterprise Email Address *</label>
                  <Input 
                    type="email" 
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-8 text-xs border-slate-200 focus:border-blue-500 rounded-md"
                    placeholder="e.g. sarah@acme.corp"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Assigned Functional Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-2.5 h-8 rounded-md border border-slate-200 bg-white font-medium text-xs focus:outline-none focus:border-blue-500 transition-colors"
                  >
                    {rolesList.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>

                <div className="space-y-1.5 pt-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Granted Functional Permissions</label>
                  <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-650">
                    {permissionsOptions.map((perm) => {
                      const active = permissions.includes(perm);
                      return (
                        <button
                          key={perm}
                          type="button"
                          onClick={() => handleTogglePermission(perm)}
                          className={`px-2 py-1.5 rounded-md border text-left flex items-center justify-between gap-1 transition-all cursor-pointer ${
                            active 
                              ? 'bg-blue-50/50 border-blue-400 text-blue-700 font-bold' 
                              : 'bg-white border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <span className="truncate">{perm}</span>
                          {active && <Check className="size-3 text-blue-600 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2.5">
                  <Button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    variant="ghost" 
                    size="sm" 
                    className="h-8 rounded-md font-semibold text-xs text-slate-500 hover:bg-slate-100 cursor-pointer"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    size="sm" 
                    className="h-8 rounded-md font-semibold text-xs text-white bg-blue-600 hover:bg-blue-700 cursor-pointer"
                  >
                    Dispatch Invitation
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </motion.div>
  );
}
