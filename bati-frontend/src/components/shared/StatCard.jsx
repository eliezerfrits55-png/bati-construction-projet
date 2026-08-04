const StatCard = ({ title, value, icon, color = "orange", trend = null }) => {
  const colorStyles = {
    orange: {
      bg: "bg-orange-50",
      iconBg: "bg-orange-100",
      text: "text-orange-600",
    },
    blue: {
      bg: "bg-blue-50",
      iconBg: "bg-blue-100",
      text: "text-blue-600",
    },
    green: {
      bg: "bg-green-50",
      iconBg: "bg-green-100",
      text: "text-green-600",
    },
    purple: {
      bg: "bg-purple-50",
      iconBg: "bg-purple-100",
      text: "text-purple-600",
    },
    red: {
      bg: "bg-red-50",
      iconBg: "bg-red-100",
      text: "text-red-600",
    },
  };

  const styles = colorStyles[color] || colorStyles.orange;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {trend && (
            <p
              className={`text-xs mt-1 font-medium ${
                trend.startsWith("+") ? "text-green-600" : "text-red-600"
              }`}
            >
              {trend}
            </p>
          )}
        </div>
        <div
          className={`w-11 h-11 rounded-lg ${styles.iconBg} flex items-center justify-center text-xl`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
