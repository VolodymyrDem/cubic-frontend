// src/pages/admin/AdminTeachers.tsx
import React, { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Plus, Edit2, Trash2, Users } from "lucide-react";
import type { Teacher } from "@/types/teachers";
import type { Course } from "@/types/courses";

// ✅ FAKE API для викладачів
const fetchTeachers = async (): Promise<Teacher[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: "t1",
          name: "Іванов Іван Іванович",
          email: "ivanov@uni.ua",
          subjects: ["Бази даних", "Програмування"],
        },
        {
          id: "t2",
          name: "Петренко Марія Олександрівна",
          email: "petrenko@uni.ua",
          subjects: ["Математика", "Алгоритми"],
        },
        {
          id: "t3",
          name: "Сидоренко Олег Петрович",
          email: "sydorenko@uni.ua",
          subjects: ["Веб-технології"],
        },
      ]);
    }, 300);
  });
};

// ✅ FAKE API для курсів (для dropdown)
const fetchCourses = async (): Promise<Course[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: "c1", code: "DB101", title: "Бази даних", groupIds: [], teacherId: "t1" },
        { id: "c2", code: "PROG101", title: "Програмування", groupIds: [], teacherId: "t1" },
        { id: "c3", code: "MATH101", title: "Математика", groupIds: [], teacherId: "t2" },
        { id: "c4", code: "ALG101", title: "Алгоритми", groupIds: [], teacherId: "t2" },
        { id: "c5", code: "WEB101", title: "Веб-технології", groupIds: [], teacherId: "t3" },
      ]);
    }, 300);
  });
};

const AdminTeachers: React.FC = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [q, setQ] = useState("");

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [teacherForm, setTeacherForm] = useState({ name: "", email: "", subjects: [] as string[] });

  // Load data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [teachersData, coursesData] = await Promise.all([
        fetchTeachers(),
        fetchCourses(),
      ]);
      setTeachers(teachersData);
      setCourses(coursesData);
    } catch (error) {
      console.error("Failed to load data:", error);
    }
  };

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return teachers;
    return teachers.filter((t) =>
      t.name.toLowerCase().includes(s) ||
      t.email.toLowerCase().includes(s) ||
      t.subjects.some(subj => subj.toLowerCase().includes(s))
    );
  }, [teachers, q]);

  // Handlers
  const handleCreate = () => {
    if (!teacherForm.name.trim() || !teacherForm.email.trim()) {
      alert("Введіть ПІБ та Email");
      return;
    }

    console.log('[FAKE] Creating teacher:', teacherForm);
    const newTeacher: Teacher = {
      id: `t${Date.now()}`,
      name: teacherForm.name,
      email: teacherForm.email,
      subjects: teacherForm.subjects,
    };

    setTeachers([...teachers, newTeacher]);
    setDialogOpen(false);
    setTeacherForm({ name: "", email: "", subjects: [] });
  };

  const handleUpdate = () => {
    if (!editingTeacher) return;
    if (!teacherForm.name.trim() || !teacherForm.email.trim()) {
      alert("Введіть ПІБ та Email");
      return;
    }

    console.log('[FAKE] Updating teacher:', editingTeacher.id, teacherForm);
    setTeachers(teachers.map((t) =>
      t.id === editingTeacher.id
        ? { ...t, name: teacherForm.name, email: teacherForm.email, subjects: teacherForm.subjects }
        : t
    ));

    setDialogOpen(false);
    setEditingTeacher(null);
    setTeacherForm({ name: "", email: "", subjects: [] });
  };

  const handleDelete = (id: string) => {
    if (!confirm("Видалити цього викладача?")) return;

    console.log('[FAKE] Deleting teacher:', id);
    setTeachers(teachers.filter((t) => t.id !== id));
  };

  const openEditDialog = (teacher: Teacher) => {
    setEditingTeacher(teacher);
    setTeacherForm({ name: teacher.name, email: teacher.email, subjects: teacher.subjects });
    setDialogOpen(true);
  };

  const toggleSubject = (courseTitle: string) => {
    setTeacherForm(prev => ({
      ...prev,
      subjects: prev.subjects.includes(courseTitle)
        ? prev.subjects.filter(s => s !== courseTitle)
        : [...prev.subjects, courseTitle]
    }));
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
          <Users className="w-10 h-10" />
          Викладачі
        </h1>
      </motion.div>

      {/* Search & Add */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex gap-4 flex-wrap"
      >
        <div className="flex-1 min-w-[250px]">
          <Input
            placeholder="Пошук за ПІБ, email або предметом..."
            className="input"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <Button
          onClick={() => {
            setEditingTeacher(null);
            setTeacherForm({ name: "", email: "", subjects: [] });
            setDialogOpen(true);
          }}
          className="btn-primary"
        >
          <Plus className="w-4 h-4 mr-2" />
          Додати викладача
        </Button>
      </motion.div>

      {/* Teachers Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="glasscard">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Список викладачів
            </CardTitle>
            <CardDescription>
              Знайдено {filtered.length} з {teachers.length} викладачів
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-3 text-muted font-medium">ПІБ</th>
                    <th className="text-left p-3 text-muted font-medium">Email</th>
                    <th className="text-left p-3 text-muted font-medium">Предмети</th>
                    <th className="text-right p-3 text-muted font-medium">Дії</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((t, index) => (
                    <motion.tr
                      key={t.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="border-b border-border/50 hover:bg-surface-2/30 transition-colors"
                    >
                      <td className="p-3 font-medium">{t.name}</td>
                      <td className="p-3 text-muted">{t.email}</td>
                      <td className="p-3">
                        <div className="flex flex-wrap gap-1">
                          {t.subjects.length > 0 ? (
                            t.subjects.map((subj, idx) => (
                              <Badge key={idx} variant="outline" className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                                {subj}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-muted-foreground text-sm">Немає предметів</span>
                          )}
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex gap-2 justify-end">
                          <Button size="sm" variant="ghost" onClick={() => openEditDialog(t)}>
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => handleDelete(t.id)}>
                            <Trash2 className="w-4 h-4 text-red-400" />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-muted">
                        Нічого не знайдено...
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Teacher Dialog */}
      {dialogOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={() => setDialogOpen(false)}
        >
          <div
            className="glasscardMd w-full max-w-md p-6 m-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold mb-2">
              {editingTeacher ? "Редагувати викладача" : "Новий викладач"}
            </h2>
            <p className="text-sm text-muted mb-6">
              {editingTeacher ? "Оновіть дані викладача" : "Додайте нового викладача"}
            </p>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">ПІБ</label>
                <Input
                  placeholder="Прізвище Ім'я По батькові"
                  value={teacherForm.name}
                  onChange={(e) => setTeacherForm({ ...teacherForm, name: e.target.value })}
                  className="input"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Email</label>
                <Input
                  placeholder="email@uni.ua"
                  type="email"
                  value={teacherForm.email}
                  onChange={(e) => setTeacherForm({ ...teacherForm, email: e.target.value })}
                  className="input"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Предмети</label>
                <div className="space-y-2 max-h-48 overflow-y-auto border border-border rounded-md p-3">
                  {courses.map((course) => (
                    <label key={course.id} className="flex items-center gap-2 cursor-pointer hover:bg-surface-2/30 p-2 rounded">
                      <input
                        type="checkbox"
                        checked={teacherForm.subjects.includes(course.title)}
                        onChange={() => toggleSubject(course.title)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">{course.title} ({course.code})</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button variant="outline" onClick={() => setDialogOpen(false)} className="btn flex-1">
                Скасувати
              </Button>
              <Button onClick={editingTeacher ? handleUpdate : handleCreate} className="btn-primary flex-1">
                {editingTeacher ? "Зберегти" : "Створити"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTeachers;
