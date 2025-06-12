import { Input } from "../ui/input";

export const FolderInput = (
  props: React.InputHTMLAttributes<HTMLInputElement>
) => {
  return (
    <div className="space-y-2">
      <div>
        <label htmlFor="pdf" className="text-sm font-medium text-gray-700">
          Chọn tệp PDF
        </label>
        <Input
          {...props}
          type="file"
          multiple
          ref={(ref) => {
            if (ref) ref.setAttribute("webkitdirectory", "true");
          }}
        />
      </div>

      <div>
        <label htmlFor="pdf" className="text-sm font-medium text-gray-700">
          Chọn tệp PDF
        </label>
        <Input
          {...props}
          type="file"
          multiple
          ref={(ref) => {
            if (ref) ref.setAttribute("webkitdirectory", "true");
          }}
        />
      </div>
    </div>
  );
};
