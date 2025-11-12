import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { vi } from "vitest";

import { ClientSelector } from "@/components/demo/ClientSelector";
import { MOCK_CLIENTS } from "@/data/mockDemoData";

describe("ClientSelector", () => {
  const setup = (overrides: Partial<React.ComponentProps<typeof ClientSelector>> = {}) => {
    const onClientChange = vi.fn();
    const onGenerateReport = vi.fn();

    render(
      <ClientSelector
        selectedClientId={overrides.selectedClientId ?? MOCK_CLIENTS[0].id}
        onClientChange={overrides.onClientChange ?? onClientChange}
        isGenerating={overrides.isGenerating ?? false}
        onGenerateReport={overrides.onGenerateReport ?? onGenerateReport}
      />
    );

    return { onClientChange, onGenerateReport };
  };

  it("renders all available mock clients as select options", () => {
    setup();

    const options = screen.getAllByRole("option");
    expect(options).toHaveLength(MOCK_CLIENTS.length);
    MOCK_CLIENTS.forEach((client) => {
      expect(
        screen.getByRole("option", { name: new RegExp(client.name, "i") })
      ).toBeInTheDocument();
    });
  });

  it("invokes the change handler when a different client is selected", async () => {
    const { onClientChange } = setup();
    const select = screen.getByLabelText(/select client/i);

    await userEvent.selectOptions(select, MOCK_CLIENTS[1].id);

    expect(onClientChange).toHaveBeenCalledTimes(1);
    expect(onClientChange).toHaveBeenCalledWith(MOCK_CLIENTS[1].id);
  });

  it("shows a loading state and disables the generate button while generating", () => {
    setup({ isGenerating: true });

    const button = screen.getByRole("button", { name: /generating/i });
    expect(button).toBeDisabled();
    expect(button).toHaveTextContent("Generating...");
  });
});
