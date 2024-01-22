wait(4)
-- Initialization and references to Roblox services
local Players = game:GetService("Players")
local Workspace = game:GetService("Workspace")
local VirtualInputManager = game:GetService("VirtualInputManager")
local Camera = Workspace.CurrentCamera

-- User information
local player = Players.LocalPlayer
local humanoidRootPart = player.Character and player.Character:FindFirstChild("HumanoidRootPart")
-- Autofarm variables
local viewportSize = Camera.ViewportSize
local X, Y = viewportSize.X / 2, viewportSize.Y / 2
local clickInterval = 0.1
local Enabled = true

local function teleportAndClick(present)
    if humanoidRootPart then
        humanoidRootPart.Anchored = false
        humanoidRootPart.CFrame = CFrame.new(present.Position)
        wait(0.1)

        VirtualInputManager:SendMouseButtonEvent(X, Y, 0, true, game, 1)
        VirtualInputManager:SendMouseButtonEvent(X, Y, 0, false, game, 1)
        humanoidRootPart.Anchored = true
    end
end

local function autofarm()
    while Enabled do
        local hiddenPresents = Workspace["__THINGS"].HiddenPresents
        for _, present in ipairs(hiddenPresents:GetChildren()) do
            if present.Name == "HiddenPresent" then
                teleportAndClick(present)
                wait(clickInterval)
            end
        end
        wait(1)
    end
end

autofarm()
