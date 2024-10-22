import { useSession } from "@/hooks/use-session";
import { format } from 'sql-formatter';

export const DDLView = () => {
  const { tableDDL } = useSession();

  // Format the SQL string
  const formattedSQL = format(tableDDL, { language: "postgresql" });

  const highlightSQL = (sql: string) => {
    return sql
      .replace(/&/g, '&amp;') // Escape ampersands
      .replace(/</g, '&lt;') // Escape less-than symbol
      .replace(/>/g, '&gt;') // Escape greater-than symbol
      .replace(/"/g, '&quot;') // Escape double quotes
      // Match SQL keywords and highlight them
      .replace(
        /\b(CREATE|TABLE|ALTER|PRIMARY\s+KEY|FOREIGN\s+KEY|REFERENCES|INT|INTEGER|VARCHAR|DATETIME|NOT\s+NULL|AUTO_INCREMENT|TEXT|TIMESTAMP|CURRENT_TIMESTAMP|WITH|TIME\s+ZONE|NEXTVAL|REGCLASS)\b/gi,
        match => `<span class="text-purple-400">${match}</span>`
      )
      .replace(/`(\w+)`/g, (_, name) => `<span class="text-green-400">\`${name}\`</span>`)
      // Avoid highlighting numbers inside HTML tags
      .replace(/(?!<[^>]+)\b(\d+)\b(?![^<]*>)/g, (_, number) => `<span class="text-yellow-400">${number}</span>`);
  };

  return (
    <div className="w-[calc(100%-1rem)] h-full overflow-auto bg-stone-900 p-4 rounded-lg">
      <pre className="text-sm">
        <code className="language-sql">
          {formattedSQL.split(';').map((statement, index) => (
            <div key={index} className="mb-4">
              <br />
              <div
              className="text-white"
                dangerouslySetInnerHTML={{
                  __html: statement
                    .trim()
                    .split('\n')
                    .map(line => highlightSQL(line))
                    .join('<br />')
                }}
              />
            </div>
          ))}
        </code>
      </pre>
    </div>
  );
};
