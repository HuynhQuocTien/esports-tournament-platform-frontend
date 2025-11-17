import { tournamentService } from "../../services/tournamentService";
import React, { useState } from "react";
import "./tournament.css";

export const CreateTournamentPage: React.FC = () => {

    const [form, setForm] = useState({
        name: "",
        game: "",
        format: "",
        maxTeams: 1,
        startDate: Date.now().toString(),
        endDate: Date.now().toString(),
    });

    const [errors, setErrors] = useState<{[key: string]: string}>({});
    const [loading, setLoading] = useState(false);

    // ---------------- VALIDATION ----------------
    const validate = () => {
        const newErrors: {[key: string]: string} = {};

        if (!form.name.trim()) newErrors.name = "Tên giải đấu là bắt buộc.";
        if (!form.game.trim()) newErrors.game = "Vui lòng nhập game.";
        if (!form.format) newErrors.format = "Vui lòng chọn thể thức.";
        if (!form.maxTeams || Number(form.maxTeams) <= 1) newErrors.maxTeams = "Số đội phải lớn hơn 1.";
        if (!form.startDate) newErrors.registrationStart = "Vui lòng chọn thời gian mở đăng ký.";
        if (!form.endDate) newErrors.registrationEnd = "Vui lòng chọn thời gian đóng đăng ký.";
        if (!form.startDate) newErrors.startDate = "Vui lòng chọn ngày bắt đầu.";

        return newErrors;
    };

    // -------------- HANDLE CHANGE ----------------
    const handleChange = (field: string, value: any) => {
        setForm(prev => ({ ...prev, [field]: value }));

        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: "" }));
        }
    };

    const inputClass = (field: string) =>
        `w-full p-3 rounded bg-white text-black placeholder-gray-400
         border ${errors[field] ? "border-red-500" : "border-gray-300"}
        `;

    // ---------------- SUBMIT ----------------
    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = validate();

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            setLoading(true);
            // const res = await tournamentService.create(form);
            console.log("Tournament created:", form);
            alert("Tạo giải đấu thành công!");
        } catch (err) {
            alert("Có lỗi xảy ra khi tạo giải đấu.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto bg-white shadow-md p-4 mt-8 rounded">
            <h1 className="text-2xl font-semibold mb-4">Tạo Giải Đấu</h1>

            <form onSubmit={handleSubmit} className="space-y-4">

                {/* NAME */}
                <div>
                    <label className="block mb-1 font-medium text-left">Tên giải đấu</label>
                    <input
                        type="text"
                        className={inputClass("name")}
                        value={form.name}
                        onChange={e => handleChange("name", e.target.value)}
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1 text-left">{errors.name}</p>}
                </div>

                {/* GAME */}
                <div>
                    <label className="block mb-1 font-medium text-left">Game</label>
                    <input
                        type="text"
                        className={inputClass("game")}
                        value={form.game}
                        onChange={e => handleChange("game", e.target.value)}
                    />
                    {errors.game && <p className="text-red-500 text-sm mt-1 text-left">{errors.game}</p>}
                </div>

                {/* FORMAT */}
                <div>
                    <label className="block mb-1 font-medium text-left">Thể thức</label>
                    <select
                        className={inputClass("format")}
                        value={form.format}
                        onChange={e => handleChange("format", e.target.value)}
                    >
                        <option value="">-- Chọn thể thức --</option>
                        <option value="single">Single Elimination</option>
                        <option value="double">Double Elimination</option>
                        <option value="round_robin">Round Robin</option>
                        <option value="group">Group + Knockout</option>
                    </select>
                    {errors.format && <p className="text-red-500 text-sm mt-1">{errors.format}</p>}
                </div>

                {/* MAX TEAMS */}
                <div>
                    <label className="block mb-1 font-medium text-left">Số đội tối đa</label>
                    <input
                        type="number"
                        className={inputClass("maxTeams")}
                        value={form.maxTeams}
                        onChange={e => handleChange("maxTeams", e.target.value)}
                        min={1}
                    />
                    {errors.maxTeams && <p className="text-red-500 text-sm mt-1 text-left">{errors.maxTeams}</p>}
                </div>

                {/* START DATE */}
                <div>
                    <label className="block mb-1 font-medium text-left">Ngày bắt đầu</label>
                    <input
                        type="datetime-local"
                        className={inputClass("startDate")}
                        value={form.startDate}
                        onChange={e => handleChange("startDate", e.target.value)}
                    />
                    {errors.startDate && (
                        <p className="text-red-500 text-sm mt-1 text-left">{errors.startDate}</p>
                    )}
                </div>

                 {/* End date */}
                <div>
                    <label className="block mb-1 font-medium text-left">Ngày kết thúc</label>
                    <input
                        type="datetime-local"
                        className={inputClass("endDate")}
                        value={form.endDate}
                        onChange={e => handleChange("endDate", e.target.value)}
                    />
                    {errors.endDate && <p className="text-red-500 text-sm">{errors.endDate}</p>}
                </div>

                {/* SUBMIT */}
                <button
                    disabled={loading}
                    className="bg-green-600 text-white px-4 py-2 rounded"
                >
                    {loading ? "Đang tạo..." : "Tạo giải đấu"}
                </button>
            </form>
        </div>
    );
};
